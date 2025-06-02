import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateComment({
                                        productName,
                                        productDetails,
                                        brand,
                                        existingComments,
                                        rating,
                                        gender
                                      }) {
  const prompt = `
Scrie un comentariu natural, ca de la un om real, in limba romana (fara diacritice).
• Comentariul trebuie sa para sincer, prietenos, cu emotii autentice.
• Foloseste limbaj informal, dar clar (accepta mici greseli gramaticale).
• Foarte important sa para autentic uman. Deci foloseste jargon.
• NU folosi ton robotizat!

REGULI in functie de rating:
  – 5 ★: entuziast, super pozitiv, minim 2 pro‑uri concrete.
  – 4 ★: pozitiv dar cu 1 mic defect mentionat.
  – 3 ★: ton neutru, balanceaza plusuri si minusuri.
  – 2 ★: dezamagit, mentioneaza 2 probleme clare.
  – 1 ★: foarte nemultumit, ton frustrat, explica de ce e slab.

Date produs
  • Nume: ${productName}
  • Brand: ${brand}
  • Detalii: ${productDetails}

Rating dorit: ${rating} stele
Gen comentator: ${gender}
Comentarii existente: ${existingComments.join(' | ') || 'niciunul'}

Returneaza DOAR JSON strict cu cheile:
  {
    "generatedComment": "...",
    "userName": "..."
  }
`.trim();

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 180,
    messages: [{ role: 'user', content: prompt }]
  });

  const usage = completion.usage; // { prompt_tokens, completion_tokens, total_tokens }
  const content = completion.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { generatedComment: content, userName: 'Utilizator' };
  }

  return { ...parsed, usage };
}