import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 60

const CAROUSEL_SYSTEM_PROMPT = `You are an expert carousel content creator for social media. 
Your task is to generate carousel slides in a structured format.

For each slide, provide:
1. A headline (max 10 words, punchy and engaging)
2. Body text (2-3 sentences, informative and valuable)
3. An icon suggestion (chart, lightbulb, target, rocket, heart, star, check, trending, users, zap)

Format your response as JSON with this structure:
{
  "title": "Overall carousel title",
  "slides": [
    {
      "headline": "Slide headline here",
      "body": "Body text here with valuable information.",
      "icon": "chart"
    }
  ]
}

Make the content engaging, actionable, and valuable for the target audience.
Use professional but accessible language.`

export async function POST(req: Request) {
  const { messages, prompt, slideCount, platform, brandKit }: { 
    messages?: UIMessage[]
    prompt?: string
    slideCount: number
    platform: string
    brandKit: string
  } = await req.json()

  const userPrompt = prompt || (messages && messages.length > 0 
    ? messages[messages.length - 1].parts?.filter(p => p.type === 'text').map(p => (p as { type: 'text'; text: string }).text).join('') 
    : '')

  const fullPrompt = `Create a ${slideCount}-slide carousel for ${platform} about: "${userPrompt}"
  
Brand Kit being used: ${brandKit}
  
Generate exactly ${slideCount} slides with compelling content. Make sure each slide flows naturally to the next and tells a cohesive story.`

  const result = streamText({
    model: 'openai/gpt-5',
    system: CAROUSEL_SYSTEM_PROMPT,
    messages: messages 
      ? await convertToModelMessages(messages)
      : [{ role: 'user' as const, content: fullPrompt }],
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
