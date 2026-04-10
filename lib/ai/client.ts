/**
 * Unified AI client — routes to DeepSeek or Anthropic based on AI_PROVIDER env var.
 * DeepSeek is ~20x cheaper and faster for structured extraction tasks.
 *
 * Set AI_PROVIDER=deepseek in .env.local to use DeepSeek.
 * Defaults to Anthropic Claude.
 */

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function callAI(system: string, userMessage: string): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'anthropic'

  if (provider === 'deepseek') {
    const OpenAI = (await import('openai')).default
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
    })
    const res = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 4096,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage },
      ],
    })
    return res.choices[0]?.message?.content ?? ''
  }

  // Default: Anthropic Claude
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic()
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: userMessage }],
  })
  return msg.content[0].type === 'text' ? msg.content[0].text : ''
}
