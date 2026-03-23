import { NextResponse } from "next/server";
import OpenAI from "openai";
import ollama from 'ollama'


export const GET = async () => {
    const stream = await ollama.chat({
        model: 'gpt-oss:120b-cloud',
        messages: [{ role: 'user', content: 'Who is an entrepreneur?' }],
        stream: true,
        think: "medium"
    })

    let inThinking = false
    let content = ''
    let thinking = ''

    for await (const chunk of stream) {
        if (chunk.message.thinking) {
        if (!inThinking) {
            inThinking = true
            process.stdout.write('Thinking:\n')
        }
        process.stdout.write(chunk.message.thinking)
        // accumulate the partial thinking
        thinking += chunk.message.thinking
        } else if (chunk.message.content) {
        if (inThinking) {
            inThinking = false
            process.stdout.write('\n\nAnswer:\n')
        }
        process.stdout.write(chunk.message.content)
        // accumulate the partial content
        content += chunk.message.content
        }
    }

    // append the accumulated fields to the messages for the next request
    const new_messages = [{ role: 'assistant', thinking: thinking, content: content }];

    return NextResponse.json({ message: "Hello", new_messages });
}