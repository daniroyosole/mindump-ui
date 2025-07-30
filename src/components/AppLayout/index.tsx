import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookText, BarChart3, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const tabs = [
  { path: "/diary", key: "diary", icon: BookText },
  { path: "/dashboard", key: "dashboard", icon: BarChart3 },
  { path: "/profile", key: "profile", icon: User, disabled: false }, // no navega aún
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <footer className="h-16 bg-white border-t border-zinc-200 shrink-0">
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-50">
          {tabs.map(({ path, key, icon: Icon, disabled }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center text-xs transition ${
                  isActive ? "text-blue-600" : "text-zinc-500"
                  } ${disabled ? "opacity-40" : ""}`}
                disabled={disabled}
              >
                <Icon size={20} />
                <span>{t(`footer.${key}`)}</span>
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
