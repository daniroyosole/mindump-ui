import { useUser } from "contexts/UserContext";

const titleize = (text: string) => text ? text.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  ) : ""
    
export default function Header() {
  const { user } = useUser();
  
  
  return (
    <header className="p-4 bg-white shadow-md">
      <h1 className="text-lg font-semibold">
        Hola {user.name ? `, ${titleize(user.shortName)} ` : ""}😊
      </h1>
      <p className="text-sm text-zinc-500">
        {user.name ? `Nice to meet you!` : "¿Cómo estás hoy?"}
      </p>
      {user.pronouns && (
        <p className="text-xs text-zinc-400 mt-1">
          Pronouns: {user.pronouns}
        </p>
      )}
    </header>
  );
}
  