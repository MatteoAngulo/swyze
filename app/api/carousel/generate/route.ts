import { generateText } from 'ai'
import { getModel } from '@/lib/ai-provider'

export const maxDuration = 60

const CAROUSEL_SYSTEM_PROMPT = `You are an expert carousel content creator for social media.
Generate carousel slides and respond ONLY with valid JSON — no markdown, no explanation, no code blocks.

JSON format:
{
  "title": "Overall carousel title",
  "slides": [
    {
      "headline": "Slide headline (max 10 words)",
      "body": "Body text with 2-3 sentences of valuable content.",
      "icon": "chart",
      "layout": "hero"
    }
  ]
}

LAYOUT RULES (very important):
- First slide MUST use "hero" layout
- Last slide MUST use "cta" layout
- Middle slides should vary between: "centered", "split", "quote", "stats"
- Use "stats" when the slide contains numbers, percentages, or data
- Use "quote" when the slide contains advice, tips, or testimonials
- Use "split" for explanatory content
- Use "centered" for general points

Available layouts: hero, centered, split, quote, stats, cta
Icon must be one of: chart, lightbulb, target, rocket, heart, star, check, trending, users, zap
Generate content in the same language as the user's prompt.`

export async function POST(req: Request) {
  const { prompt, slideCount, platform, brandKit }: {
    prompt?: string
    slideCount: number
    platform: string
    brandKit: string
  } = await req.json()

  const userPrompt = `Create a ${slideCount}-slide carousel for ${platform} about: "${prompt}"
Brand Kit: ${brandKit}
Generate exactly ${slideCount} slides. Each slide must flow naturally to the next.
Remember: first slide = "hero" layout, last slide = "cta" layout, vary the middle slides.`

  const { text } = await generateText({
    model: getModel(),
    system: CAROUSEL_SYSTEM_PROMPT,
    prompt: userPrompt,
  })

  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const data = JSON.parse(clean)

  return Response.json(data)
}
