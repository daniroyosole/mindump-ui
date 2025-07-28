// api/openai.ts
import axios from 'axios';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const sendMessage = async (messages: any[]) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.choices[0].message;
};

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
}