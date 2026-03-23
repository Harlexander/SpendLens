import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import { cleanDataSchema } from "../route";

const ollama = new Ollama();

const transactionsType = cleanDataSchema.shape.transactions
    

export const POST = async (request: Request) => {
    try {
        const { transactions } : { transactions: typeof transactionsType } = await request.json();

        if(!transactions) {
            return NextResponse.json({ message: "No data provided" }, { status: 400 });
        }

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
                - Transactions you can't confidently categorize go in "unidentified"`
            }],
            format: "json"
        })
        
        console.log(response.message.content)

        return NextResponse.json({ message: JSON.parse(response.message.content )});
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}