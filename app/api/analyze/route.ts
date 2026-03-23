import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import { z } from 'zod';

const PDFExtract = require('pdf.js-extract').PDFExtract;
const ollama = new Ollama();

export const cleanDataSchema = z.object({
    account_name: z.string(),
    account_number: z.string(),
    period: z.string(),
    opening_balance: z.string(),
    closing_balance: z.string(),
    transactions: z.array(
        z.object({
            date: z.string(),
            description: z.string(),
            debit: z.string(),
            credit: z.string(),
            balance: z.string()
        })
    )
})

export const POST = async (req: Request) => {
    try {
        const files = await req.formData();
        const file = files.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json("File required", { status: 400 });
        }

        const data = await extractPDFContent(file);

        const cleanData = await cleanUpValues(data);

        return NextResponse.json({ cleanData });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

const extractPDFContent = async (file: File) => {
    const pdfExtract = new PDFExtract();
    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await new Promise((resolve, reject) => {
        pdfExtract.extractBuffer(buffer, {}, (err: any, result: any) => {
            if (err) return reject(err);
            resolve(result.pages.map((page: any, i: number) => {
                if(i > 5) return;
                return  ({
                    page: i + 1,
                    lines: extractLines(page)
                })
            }).filter(Boolean));
        });
    });

    return data;
};

function extractLines(page: any): string[] {
    const grouped: Record<number, any[]> = {};

    for (const item of page.content) {
        if (item.str.trim() === '') continue;
        const yKey = Math.round(item.y);
        if (!grouped[yKey]) grouped[yKey] = [];
        grouped[yKey].push(item);
    }

    return Object.keys(grouped)
        .sort((a, b) => Number(a) - Number(b))
        .map(y =>
            grouped[Number(y)]
                .sort((a: any, b: any) => a.x - b.x)
                .map((item: any) => item.str.trim())
                .join(' ')
        );
}

 
async function cleanUpValues(content: any){
    const response = await ollama.chat({
        model: "minimax-m2:cloud",
        messages: [{
            role: "user",
            content: `You are a bank statement parser. Below is raw extracted text from a PDF bank statement. 
                    Some transactions are split across multiple lines — merge them intelligently.

                    Extract each transaction into this JSON format:
                    {
                    "account_name": "",
                    "account_number": "",
                    "period": "",
                    "opening_balance": "",
                    "closing_balance": "",
                    "transactions": [
                        {
                        "date": "",
                        "description": "",
                        "debit": null,
                        "credit": null,
                        "balance": null,
                        }
                    ]
                    }

                    Rules:
                    - Merge fragmented lines that belong to the same transaction
                    - Use null for debit/credit when the value is "--"
                    - Parse amounts as numbers (remove commas and currency symbols)
                    - Return ONLY valid JSON, no markdown, no explanation

                    Raw text:
                    ${JSON.stringify(content)}`
        }],
        format: "json"
    })
    
    console.log(response.message.content)

    return JSON.parse(response.message.content) as typeof cleanDataSchema.shape
}