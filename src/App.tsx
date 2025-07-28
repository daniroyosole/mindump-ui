import ChatWindow from "./components/ChatWindow";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-zinc-50 text-zinc-900">
      <Header />
      <ChatWindow />
    </div>
  );
}
