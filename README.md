# SpendLens

**AI-powered bank statement analyzer that turns messy PDF statements into clear financial insights.**

SpendLens extracts transactions from bank statement PDFs, cleans up fragmented text, and uses AI to categorize your spending — giving you a full picture of where your money goes.

## Features

- **PDF Extraction** — Parses bank statement PDFs using `pdf.js-extract`, handling messy text fragments and multi-line transactions
- **AI-Powered Categorization** — Automatically groups transactions into meaningful categories (airtime, data, food delivery, subscriptions, betting, savings — whatever exists in your data)
- **Recipient Tracking** — See who you send the most money to, how often, and total amounts
- **Fee Breakdown** — Separates bank charges, EMTL, VAT, stamp duty, and other levies so you know exactly what you're losing to fees
- **Spending Insights** — Identifies your highest spending day, highest income day, and busiest transaction day
- **Smart Merging** — AI intelligently connects fragmented transaction descriptions that span multiple lines in the PDF
- **Flexible Output** — Fixed structure for predictable fields (summary, recipients, fees), dynamic categories that adapt to your actual spending patterns
- **Unidentified Transactions** — Flags transactions that can't be confidently categorized so you can review them manually

## How It Works

```
PDF Upload → Text Extraction → Line Cleanup → AI Parsing → AI Analysis → Structured Insights
```

1. **Extract** — `pdf.js-extract` pulls raw text fragments with coordinates from the PDF
2. **Clean** — Fragments are grouped by Y-position, sorted left-to-right, and merged into readable lines. Empty strings and whitespace are stripped out
3. **Parse** — Cleaned lines are sent to a local LLM via Ollama, which merges multi-line transactions and returns structured JSON
4. **Analyze** — Parsed transactions are analyzed by AI to categorize spending, rank recipients, total fees, and surface insights

## Installation

```bash
npm install
```

### Dependencies

```bash
npm install pdf.js-extract
```

### Ollama Setup

SpendLens uses [Ollama](https://ollama.com) for local AI inference — no API keys, no cost per request.

1. Install Ollama from [ollama.com](https://ollama.com)
2. Pull a model:

```bash
ollama pull llama3.1
# or for better JSON accuracy:
ollama pull llama3.1:70b
```

3. Make sure Ollama is running (default: `http://localhost:11434`)

## Usage

```typescript
import { extractAndAnalyze } from "./spendlens";

const file = // your PDF File object
const analysis = await extractAndAnalyze(file);

console.log(analysis.summary);
console.log(analysis.categories);
console.log(analysis.top_recipients);
```

## Output Structure

The analysis returns a hybrid JSON structure — fixed keys for predictable data, flexible categories for your unique spending patterns.

### Fixed Fields (always present)

| Field | Description |
|-------|-------------|
| `summary` | Total income, expenses, net cash flow, transaction count, period |
| `spending_days` | Day you spent the most, received the most, and had the most transactions |
| `top_recipients` | People/merchants you send money to most, ranked by total amount |
| `top_senders` | People who send you money most, ranked by total amount |
| `fees_and_charges` | All bank/government charges broken down by type |
| `unidentified` | Transactions that couldn't be confidently categorized |

### Dynamic Fields

| Field | Description |
|-------|-------------|
| `categories` | AI-generated categories based on your actual transactions. Could include `airtime`, `data`, `food_delivery`, `pos_purchases`, `subscriptions`, `betting`, `savings`, `loan_repayment` — whatever exists in your data |

### Example Output

```json
{
  "summary": {
    "total_income": 4125798.50,
    "total_expenses": 4125798.50,
    "net_cash_flow": 0,
    "transaction_count": 553,
    "period_start": "08 Dec 2025",
    "period_end": "05 Feb 2026"
  },
  "spending_days": {
    "most_spent": {
      "date": "09 Dec 2025",
      "total": 45000,
      "transaction_count": 12
    }
  },
  "top_recipients": [
    { "name": "iFitness OGUDU", "total_sent": 4200, "count": 12 },
    { "name": "Chowdeck", "total_sent": 38500, "count": 23 }
  ],
  "fees_and_charges": {
    "total": 2850,
    "items": [
      { "type": "EMTL", "total": 1500, "count": 30 },
      { "type": "VAT", "total": 750, "count": 15 }
    ]
  },
  "categories": {
    "airtime": { "total_spent": 5000, "count": 12 },
    "food_delivery": { "total_spent": 38500, "count": 23 },
    "savings": { "total_spent": 200000, "count": 30 }
  },
  "unidentified": [
    { "date": "08 Dec 2025", "amount": 350, "description": "...", "type": "debit" }
  ]
}
```

## Tech Stack

- **TypeScript** — Type-safe development
- **pdf.js-extract** — PDF text extraction
- **Ollama** — Local AI inference for transaction parsing and categorization (no API keys needed)

## Supported Banks

SpendLens is designed to be bank-agnostic. Since AI handles the semantic parsing, it adapts to different statement formats automatically. Tested with:

- OPay
- Access Bank
- More banks coming as users test with their statements

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/new-bank-support`)
3. Commit your changes (`git commit -m 'Add support for GTBank statements'`)
4. Push to the branch (`git push origin feature/new-bank-support`)
5. Open a Pull Request

## License

MIT