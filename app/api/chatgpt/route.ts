import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });

    const config = {
      responseMimeType: "text/plain",
    };

    const model = "gemini-1.5-pro";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: question,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let reply = "";
    for await (const chunk of response) {
      reply += chunk.text;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    }
    return NextResponse.json({ error: "An unknown error occurred." });
  }
};

// export const POST = async (request: Request) => {
//   const { question } = await request.json();

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a knowlegeable assistant that provides quality information.",
//           },
//           {
//             role: "user",
//             content: `Tell me ${question}`,
//           },
//         ],
//       }),
//     });

//     const responseData = await response.json();
//     const reply = responseData.choices[0].message.content;
//     return NextResponse.json({ reply });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message });
//     }
//     return NextResponse.json({ error: "An unknown error occurred." });
//   }
// };
