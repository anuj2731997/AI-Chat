

import { convertToModelMessages, streamText } from "ai";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";

export const dynamic = "force-dynamic";


const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});


function convertStoredMessageToUI(msg) {
  try {
    const parts = JSON.parse(msg.content);
    const validParts = Array.isArray(parts)
      ? parts.filter((part) => part.type === "text")
      : [];

    if (validParts.length === 0) return null;

    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: validParts,
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  }
}

function extractPartsAsJSON(message) {
  if (message?.parts && Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  const content = message?.content ?? "";
  return JSON.stringify([{ type: "text", text: content }]);
}


export async function POST(req) {
  try {
    const {
      chatId,
      messages: newMessages,
      model,
      skipUserMessage,
    } = await req.json();

    if (!chatId) {
      return new Response(
        JSON.stringify({ error: "chatId is required" }),
        { status: 400 }
      );
    }

    const safeModel = model ?? "openai/gpt-4o-mini";

    
    const previousMessages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    const uiMessages = previousMessages
      .map(convertStoredMessageToUI)
      .filter(Boolean);

    const normalizedNewMessages = Array.isArray(newMessages)
      ? newMessages
      : [newMessages];

    const allUIMessages = [...uiMessages, ...normalizedNewMessages];



    let modelMessages;

    try {
      modelMessages = await convertToModelMessages(allUIMessages);
    } catch {
      modelMessages = allUIMessages
        .map((msg) => ({
          role: msg.role,
          content: msg.parts
            ?.filter((p) => p.type === "text")
            ?.map((p) => p.text)
            ?.join("\n"),
        }))
        .filter((m) => m.content);
    }

    if (!Array.isArray(modelMessages)) {
      throw new Error("Invalid modelMessages format");
    }


    const result = streamText({
      model: provider.chat(safeModel),
      messages: modelMessages,
      system: CHAT_SYSTEM_PROMPT,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allUIMessages,

      onFinish: async ({ responseMessage }) => {
        try {
          const messagesToSave = [];

         
          if (!skipUserMessage) {
            const latestUserMessage =
              normalizedNewMessages[normalizedNewMessages.length - 1];

            if (latestUserMessage?.role === "user") {
              messagesToSave.push({
                chatId,
                content: extractPartsAsJSON(latestUserMessage),
                messageRole: MessageRole.USER,
                model: safeModel,
                messageType: MessageType.NORMAL,
              });
            }
          }

          if (responseMessage?.parts?.length > 0) {
            const assistantContent =
              extractPartsAsJSON(responseMessage);

            messagesToSave.push({
              chatId,
              content: assistantContent,
              messageRole: MessageRole.ASSISTANT,
              model: safeModel,
              messageType: MessageType.NORMAL,
            });
          }

          if (messagesToSave.length > 0) {
            await db.message.createMany({
              data: messagesToSave,
            });
          }
        } catch (error) {
          console.error("❌ Error saving messages:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}