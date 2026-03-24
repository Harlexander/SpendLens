import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import OpenAI from "openai";
import { z } from 'zod';
import { zodTextFormat } from "openai/helpers/zod";

const PDFExtract = require('pdf.js-extract').PDFExtract;
const ollama = new Ollama();
const client = new OpenAI();

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

        const chunkedData = chunkArray(data, 2)

        console.log("chunkedarray", chunkedData.length)

        const headerInfor = await extractStatementInfo(chunkedData[0]);

        console.log("headerInfor", headerInfor);

        const cleanedData = await Promise.all(chunkedData.map(async (chunk) => {
            return await cleanUpValues(chunk)
        }))

        console.log(cleanedData)

        const response = {
            ...headerInfor,
            transactions: cleanedData.flatMap((chunk: any) => chunk.transactions)
        }

        return NextResponse.json({ response });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

const extractPDFContent = async (file: File) => {
    const pdfExtract = new PDFExtract();
    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await new Promise<{page: number, lines: string[]}[]>((resolve, reject) => {
        pdfExtract.extractBuffer(buffer, {}, (err: any, result: any) => {
            if (err) return reject(err);
            resolve(result.pages.map((page: any, i: number) => {
                if(i > 10) return;
                return  ({
                    page: i + 1,
                    lines: extractLines(page)
                })
            }).filter(Boolean) as {
                page: number;
                lines: string[];
            }[]);
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

const extractStatementInfo = async (content: any) => {
    try {
        const cleanData = await ollama.chat({
        model: "minimax-m2:cloud",
        messages: [{
            role: "user",
            content: extractStatementInformation(JSON.stringify(content))
        }],
        format: "json"
    });

    return JSON.parse(cleanData.message.content) as {
        account_name: string;
        account_number: string;
        period: string;
        opening_balance: string;
        closing_balance: string;
    };
    } catch (error) {
        console.log(error);
    }
}
 
async function cleanUpValues(content: any){
    try {
        const extractTranactions = await ollama.chat({
            model: "minimax-m2:cloud",
            messages: [{
                role: "user",
                content: extractValuesPrompt(JSON.stringify(content))
            }],
            format: "json"
        });

        console.log("transactions", extractTranactions.message.content);

        return JSON.parse(extractTranactions.message.content) as typeof cleanDataSchema.shape

    } catch (error) {
        console.log(error)
    }
}

const openAICleanUp = async (content: any) => {
    try {
        const response = await client.responses.create({
            model: "gpt-5.4",
            instructions: "You are a bank statement parser.",
            input: `Below is raw extracted text from a PDF bank statement. 
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
                    ${JSON.stringify(content)}`,
            text: {
                format: zodTextFormat(cleanDataSchema, "cleandata")
            }
        });

        console.log(response.output_text);
    } catch (error) {
        
    }
}

const extractStatementInformation = (content:string) => (`You are a text cleaner. Merge broken transaction lines into single lines. Extract into a JSON of this format {"account_name": "",
                    "account_number": "",
                    "period": "",
                    "opening_balance": "",
                    "closing_balance": ""}
                    content: ${content}`);

const extractValuesPrompt =  (content:string) => (`You are a bank statement parser. Below is raw extracted text from a PDF bank statement. 
                    You are a text cleaner. Merge broken transaction lines into single lines.
                    Extract each transaction into this JSON format:
                    {
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
                    
                    content: ${JSON.stringify(content)} 
                    
                    Rules:
                    - Merge fragmented lines that belong to the same transaction
                    - Use null for debit/credit when the value is "--"
                    - Parse amounts as numbers (remove commas and currency symbols)
                    - Return ONLY valid JSON, no markdown, no explanation
`)
                    

const chunkArray = <T> (arr: T[], size: number) => {
    const chunks: T[][] = [];

    for(let i = 0; i < arr.length; i += size){
        const chunk = arr.slice(i, i + size);
        chunks.push(chunk);
    }

    return chunks;
}