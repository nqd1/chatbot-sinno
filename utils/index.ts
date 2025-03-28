import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    console.log("Sending request to OpenAI...");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      method: "POST",
      body: JSON.stringify({
        model: OpenAIModel.DAVINCI_TURBO,
        messages: [
          {
            role: "system",
            content: `You are a helpful, friendly, assistant.`
          },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.0,
        stream: true
      })
    });

    if (res.status !== 200) {
      const error = await res.json();
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI API returned an error: ${res.status} ${JSON.stringify(error)}`);
    }

    console.log("Response received from OpenAI");
    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;

            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              console.error("Parsing error:", e);
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      }
    });

    return stream;
  } catch (error) {
    console.error("Stream error:", error);
    throw error;
  }
};

export const GeminiStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    console.log("Sending request to Gemini API with streaming...");
    const res = await fetch("/api/chat", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        messages,
        stream: true
      })
    });

    if (res.status !== 200) {
      const error = await res.json();
      console.error("Gemini API Error:", error);
      throw new Error(`Gemini API returned an error: ${res.status} ${JSON.stringify(error)}`);
    }

    console.log("Response received from Gemini with streaming");
    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;

            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              if (json.error) {
                console.error("Gemini API streaming error:", json.error);
                controller.error(new Error(json.error));
                return;
              }
              
              const text = json.chunk;
              if (text) {
                const queue = encoder.encode(text);
                controller.enqueue(queue);
              }
            } catch (e) {
              console.error("Parsing error:", e);
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      }
    });

    return stream;
  } catch (error) {
    console.error("Stream error:", error);
    throw error;
  }
};
