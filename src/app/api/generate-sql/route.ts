import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { schema, prompt } = await req.json();
  const message = `
  O seu trabalho é criar queries em SQL a partir de um schema SQL abaixo.
  
  Schema SQL:
  """
  ${schema}
  """

  A partir do schema acima, escreva uma query SQL a partir da solicitação abaixo.
  Me retorne somente o código SQL.

  Solicitação: ${prompt}
  `.trim();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
