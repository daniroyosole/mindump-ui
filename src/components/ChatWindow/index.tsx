import { useEffect, useState } from "react";
import MessageList from "../MessageList";
import InputBar from "../InputBar";
import { sendMessage, type Message } from "api/openai";
import { INITIAL_PROMPT, MAX_CONTEXT_MESSAGES } from "constants/index";
import { useUser, type User } from "contexts/UserContext";
import { getFromCookies, saveToCookies } from "functions/cookies";

export default function ChatWindow() {
  const { user, updateUser, setFirstInteractionComplete } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: INITIAL_PROMPT },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const extractUserInfo = (content: string) => {
    const askName = [
      { role: "system", content: "Devuelve el nombre y los pronombres en formato JSON para que pueda hacer JSON.parse de lo que reciba. Tiene que seguir esta estructura, no pongas json al inicio, ni cosas innecesarias, solo esto: { name: string, shortName: string, pronouns: string}, no corrijas el nombre, si crees que hay una falta de ortografia, ignorala" },
      { role: "user", content }
    ];
    sendMessage(askName).then((reply) => {
      updateUser(JSON.parse(reply.content) as User)
    });
  };

  const summarize = () => {
    const previousContext = getFromCookies("mindump-context")
    const lastMessages = messages.filter(msg => msg.role !== "system").slice(messages.length - MAX_CONTEXT_MESSAGES)
    const summaryPrompt = [
      { role: "system", content: `Devuelve un resumen concerto y especifico, no añadas ruido ni opinion, con los key points de la conversacion, conciso, quedate con palabras clave, acciones, personas, lugares, ambitos, y emociones, no tiene que ser leible, resumelo para que una ia lo entienda, el contexto anterior es ${previousContext ?? "no hay contexto anterior"}, la conversacion es la siguiente: ${JSON.stringify(lastMessages)}` },
    ];
    sendMessage(summaryPrompt).then((reply) => {
      console.log(reply)
      saveToCookies("mindump-context", reply.content)
      // setSummary(JSON.parse(reply.content))
    });
  };


  const handleSend = (content: string) => {
    const newMessage = { role: "user", content } as Message
    const updated = [...messages, newMessage];
    setMessages(updated);
    setIsLoading(true);

    // If this is the first user message, try to extract user info
    if (user.isFirstInteraction && !user.name) {
      extractUserInfo(content);
      setFirstInteractionComplete();
    }

    const previousContext = getFromCookies("mindump-context")
    const filteredMessages = updated.filter(msg => msg.role !== "system")
    const lastMessages = filteredMessages.slice(Math.floor(filteredMessages.length / MAX_CONTEXT_MESSAGES) * MAX_CONTEXT_MESSAGES)
    const finalPrompt = [
      { role: "system", content: INITIAL_PROMPT },
      { role: "system", content: `El contexto anterior es: ${previousContext ?? "no hay contexto anterior"}` },
      ...(lastMessages.length ? lastMessages : filteredMessages.slice(-4))
    ];
    sendMessage(finalPrompt).then((reply) => {
      const newMessages = [...updated, reply]
      setMessages(newMessages);
      if (newMessages.length % MAX_CONTEXT_MESSAGES) {
        saveToCookies("mindump-messages", JSON.stringify(newMessages))
      } else {
        summarize()
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const initialMessages = getFromCookies("mindump-messages")
    if (initialMessages) {
      console.log(initialMessages, JSON.parse(initialMessages))
      setMessages(JSON.parse(initialMessages))
    } else {
      // Send initial message to ask for user's name and pronouns
      sendMessage(messages).then((reply) => {
        setMessages([...messages, reply]);
      });
    }
  }, []);
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MessageList messages={messages} isLoading={isLoading} />
      <InputBar onSend={handleSend} />
    </div>
  );
}
