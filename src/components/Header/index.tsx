import { mindumpApi } from "api/mindumpApi";
import { useUser } from "contexts/UserContext";
import { getLocalDateISO } from "functions/date";

const titleize = (text: string) => text ? text.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  ) : ""
    
export default function Header() {
  const { user } = useUser();
  
  const onSummary = () => {
    if (user.user_uuid) {
      mindumpApi.generateSummary(user.user_uuid, getLocalDateISO()).then((response) => {
        console.log(response)
      })
    }
  }
  return (
    <header className="p-4 bg-white shadow-md flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold">
          Hola {user.name ? `, ${titleize(user.name)} ` : ""}😊
        </h1>
        <p className="text-sm text-zinc-500">
          {user.name ? `Nice to meet you!` : "¿Cómo estás hoy?"}
        </p>
      </div>
      <button
        onClick={onSummary}
        className="text-sm px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
      >
        Resumen
      </button>
    </header>
  );
}
  