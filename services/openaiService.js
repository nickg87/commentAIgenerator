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
  const prompt = `Scrie un comentariu natural, ca de la un om real, in limba romana (fara diacritice), pentru un produs.\n` +
    `Comentariul trebuie sa para sincer, prietenos si sa reflecte o experienta reala (inventata) cu produsul\n` +
    `Foloseste limbaj informal, dar clar. Evita formulari robotice (poate chiar cu greseli gramaticale din cand in cand). Poti adauga emotii, expresii personale sau comparatii.\n` +
    `Produs: ${productName}\nBrand: ${brand}\nDetalii: ${productDetails}\n` +
    `Rating dorit: ${rating} stele\nGen comentator: ${gender}\n` +
    `Comentarii existente: ${existingComments.join(' | ') || 'niciunul'}\n` +
    `Returneaza raspuns JSON exact cu cheile generatedComment si userName.`;

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