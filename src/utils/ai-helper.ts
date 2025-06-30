import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'sk-9y5Z5Kv2M0P0Z2t2T2Z2Z2Z2Z2Z2Z2Z2' });

export async function callAiFunction(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return response.choices[0].message.content.trim();
}

export function callTextToImage(
  prompt: string,
): Promise<{ imageUrl: string; seed?: string }> {
  // Call your preferred text-to-image API
  // This is a dummy placeholder
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    imageUrl: `https://dummy.image.generator/${encodeURIComponent(prompt)}.png`,
    seed: Math.floor(Math.random() * 1000000).toString(),
  };
}
export function callGenerateSceneDescriptions(
  script: string,
  duration: number,
): Array<any> {
  // Giả lập chia script thành các đoạn, mỗi đoạn khoảng 6–8s
  const sceneCount = Math.max(1, Math.floor(duration / 7));
  const sentences = script.split(/[.?!]/).filter((s) => s.trim().length > 10);

  const result: any[] = [];

  for (let i = 0; i < sceneCount; i++) {
    const baseText =
      sentences[i % sentences.length] || 'Một cảnh ngắn mô tả hành động';
    result.push({
      description: `Cảnh ${i + 1}: ${baseText.trim()}`,
      dialogue: '',
      prompt: `A cinematic illustration of scene ${i + 1}: ${baseText.trim()}`,
      characters: [],
    });
  }

  return result;
}
