import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import { z } from "zod";
import { cleanDataSchema } from "../route";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
const ollama = new Ollama();
const openAI = new OpenAI();


const transactionsType = cleanDataSchema.shape.transactions;

export const reviewSchema = z.object({
    summary: z.object({
        total_income: z.number(),
        total_expenses: z.number(),
        net_cash_flow: z.number(),
        transaction_count: z.number(),
        period_start: z.string(),
        period_end: z.string(),
    }),

    spending_days: z.object({
        most_spent: z.object({
            date: z.string(),
            total: z.number(),
            transaction_count: z.number(),
            top_expenses: z.array(z.object({ description: z.string(), amount: z.number() })),
        }),
        most_received: z.object({
            date: z.string(),
            total: z.number(),
            transaction_count: z.number(),
            top_credits: z.array(z.object({ description: z.string(), amount: z.number() })),
        }),
        most_transactions: z.object({
            date: z.string(),
            total_spent: z.number(),
            total_received: z.number(),
            transaction_count: z.number(),
        }),
    }),

    top_recipients: z.array(z.object({
        name: z.string(),
        bank: z.string().nullable(),
        total_sent: z.number(),
        count: z.number(),
        last_sent: z.string(),
    })),

    top_senders: z.array(z.object({
        name: z.string(),
        bank: z.string().nullable(),
        total_received: z.number(),
        count: z.number(),
        last_received: z.string(),
    })),

    fees_and_charges: z.object({
        total: z.number(),
        items: z.array(z.object({
            type: z.string(),
            total: z.number(),
            count: z.number(),
        })),
    }),

    categories: z.array(
        z.object({
            name: z.string(),
            total_spent: z.number(),
            count: z.number(),
            transactions: z.array(z.object({
                date: z.string(),
                description: z.string(),
                amount: z.number(),
                reference: z.string(),
            })),
        })
    ),

    unidentified: z.array(z.object({
        date: z.string(),
        description: z.string(),
        amount: z.number(),
        type: z.enum(["debit", "credit"]),
        reference: z.string(),
    })),
});

export type ReviewData = z.infer<typeof reviewSchema>;


export const POST = async (request: Request) => {
    try {
        const { transactions }: { transactions: typeof transactionsType } = await request.json();

        if (!transactions) {
            return NextResponse.json({ message: "No data provided" }, { status: 400 });
        }

        // const response = await openAiAnalyze(transactions);
        const response = await openAiAnalyze(transactions);
        console.log(response);

        return NextResponse.json({ message: response });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

const openAiAnalyze = async (transactions: any) => {
    const response = await openAI.responses.create({
        model: "gpt-5.2",
        instructions: "You are a bank statement analyst.",
        input: `You are a bank statement analyst. Analyze these transactions thoroughly.

                Transactions:
                ${JSON.stringify(transactions, null, 2)}

                Return ONLY valid JSON matching this structure exactly. No markdown, no backticks, no explanation.

                {
                "summary": {
                    "total_income": number,
                    "total_expenses": number,
                    "net_cash_flow": number,
                    "transaction_count": number,
                    "period_start": "string",
                    "period_end": "string"
                },

                "spending_days": {
                    "most_spent": {
                    "date": "string",
                    "total": number,
                    "transaction_count": number,
                    "top_expenses": [{ "description": "string", "amount": number }]
                    },
                    "most_received": {
                    "date": "string",
                    "total": number,
                    "transaction_count": number,
                    "top_credits": [{ "description": "string", "amount": number }]
                    },
                    "most_transactions": {
                    "date": "string",
                    "total_spent": number,
                    "total_received": number,
                    "transaction_count": number
                    }
                },

                "top_recipients": [
                    {
                    "name": "string",
                    "bank": "string or null",
                    "total_sent": number,
                    "count": number,
                    "last_sent": "string"
                    }
                ],

                "top_senders": [
                    {
                    "name": "string",
                    "bank": "string or null",
                    "total_received": number,
                    "count": number,
                    "last_received": "string"
                    }
                ],

                "fees_and_charges": {
                    "total": number,
                    "items": [
                    {
                        "type": "string (e.g. EMTL, VAT, Stamp Duty, Transfer Fee, etc.)",
                        "total": number,
                        "count": number
                    }
                    ]
                },

                "categories": {
                    "<category_name>": {
                    "total_spent": number,
                    "count": number,
                    "transactions": [
                        {
                        "date": "string",
                        "description": "string",
                        "amount": number,
                        "reference": "string"
                        }
                    ]
                    }
                },

                "unidentified": [
                    {
                    "date": "string",
                    "description": "string",
                    "amount": number,
                    "type": "debit | credit",
                    "reference": "string"
                    }
                ]
                }

                Rules:
                - "summary", "spending_days", "top_recipients", "top_senders", "fees_and_charges", "unidentified" — ALWAYS present, exact shape as above
                - "categories" — FLEXIBLE. Create categories based on what actually exists in the data (e.g. "airtime", "data", "food_delivery", "pos_purchases", "savings", "subscriptions", "betting", "entertainment", "bills" — whatever you find). Don't force empty categories. Each category must follow the { total_spent, count, transactions[] } shape.
                - Sort top_recipients and top_senders by total descending, max 10 each
                - Normalize recipient names (e.g. "JOHN DOE" and "John Doe" = same person)
                - Fees include: EMTL, VAT, stamp duty, maintenance fees, levies, charges — anything deducted by the bank or government
                - Subscriptions are recurring payments to the same merchant — put them in a "subscriptions" category if they exist
                - Amounts must be numbers not strings, remove commas and currency symbols
                - Only include categories that actually have transactions
                - Transactions you can't confidently categorize go in "unidentified"`,
        text: {
            format: zodTextFormat(reviewSchema, "review")
        }
    });

    return JSON.parse(response.output_text)
}


const ollamaAnallyze = async (transactions:any) => {
            const response = await ollama.chat({
            model: "minimax-m2:cloud",
            messages: [{
                role: "user",
                content: `You are a bank statement analyst. Analyze these transactions thoroughly.

                Transactions:
                ${JSON.stringify(transactions, null, 2)}

                Return ONLY valid JSON matching this structure exactly. No markdown, no backticks, no explanation.

                {
                "summary": {
                    "total_income": number,
                    "total_expenses": number,
                    "net_cash_flow": number,
                    "transaction_count": number,
                    "period_start": "string",
                    "period_end": "string"
                },

                "spending_days": {
                    "most_spent": {
                    "date": "string",
                    "total": number,
                    "transaction_count": number,
                    "top_expenses": [{ "description": "string", "amount": number }]
                    },
                    "most_received": {
                    "date": "string",
                    "total": number,
                    "transaction_count": number,
                    "top_credits": [{ "description": "string", "amount": number }]
                    },
                    "most_transactions": {
                    "date": "string",
                    "total_spent": number,
                    "total_received": number,
                    "transaction_count": number
                    }
                },

                "top_recipients": [
                    {
                    "name": "string",
                    "bank": "string or null",
                    "total_sent": number,
                    "count": number,
                    "last_sent": "string"
                    }
                ],

                "top_senders": [
                    {
                    "name": "string",
                    "bank": "string or null",
                    "total_received": number,
                    "count": number,
                    "last_received": "string"
                    }
                ],

                "fees_and_charges": {
                    "total": number,
                    "items": [
                    {
                        "type": "string (e.g. EMTL, VAT, Stamp Duty, Transfer Fee, etc.)",
                        "total": number,
                        "count": number
                    }
                    ]
                },

                "categories": [
                    {
                        "name": "string",
                        "total_spent": number,
                        "count": number,
                        "transactions": [
                            {
                            "date": "string",
                            "description": "string",
                            "amount": number,
                            "reference": "string"
                            }
                        ]
                    }
                ],

                "unidentified": [
                    {
                    "date": "string",
                    "description": "string",
                    "amount": number,
                    "type": "debit | credit",
                    "reference": "string"
                    }
                ]
                }

                Rules:
                - "summary", "spending_days", "top_recipients", "top_senders", "fees_and_charges", "unidentified" — ALWAYS present, exact shape as above
                - "categories" — FLEXIBLE. Create categories based on what actually exists in the data (e.g. "airtime", "data", "food_delivery", "pos_purchases", "savings", "subscriptions", "betting", "entertainment", "bills" — whatever you find). Don't force empty categories. Each category must follow the { total_spent, count, transactions[] } shape.
                - Sort top_recipients and top_senders by total descending, max 10 each
                - Normalize recipient names (e.g. "JOHN DOE" and "John Doe" = same person)
                - Fees include: EMTL, VAT, stamp duty, maintenance fees, levies, charges — anything deducted by the bank or government
                - Subscriptions are recurring payments to the same merchant — put them in a "subscriptions" category if they exist
                - Amounts must be numbers not strings, remove commas and currency symbols
                - Only include categories that actually have transactions
                - Transactions you can't confidently categorize go in "unidentified"`
            }],
            format: "json"
        });

        return JSON.parse(response.message.content) as typeof reviewSchema.shape;
}