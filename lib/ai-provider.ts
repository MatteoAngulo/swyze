import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export function getModel() {
  return groq('llama-3.1-8b-instant')
}
