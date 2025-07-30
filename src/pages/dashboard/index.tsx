import { useEffect, useState } from "react";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";
import { useTranslation } from "react-i18next";
import { getEffectiveEntryDate } from "functions/date";
import { EmotionLineChart } from "components/EmotionLineChart";
import { titleize } from "functions/text";

const periodOptions: ("isoWeek" | "month")[] = ["isoWeek", "month"]
const period = periodOptions[0]

export type Dashboard = {
  id: string;
  user_uuid: string;
  percents: {
    [date: string]: number | null; // e.g., { "2025-07-28": 0.7, "2025-07-29": 0.5 }
  };
  keywords: string[]; // Top palabras clave de la semana
  issues: {
    id: string;
    label: string;
    description: string; // breve, opcional
  }[];
  summary: string; // resumen narrativo de la semana
};

export default function DashboardPage() {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState<Dashboard | undefined>();
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation()

  const dashboardDate = getEffectiveEntryDate();
  

  const loadDashboard = () => {
    if (user.user_uuid) {
      setLoading(true)
      mindumpApi.hasSummaryInPeriod({ user_uuid: user.user_uuid, date: dashboardDate, period }).then((summaryResponse) => {
        setShowDashboard(summaryResponse)
        if (summaryResponse) {
          mindumpApi.getDashboard({ user_uuid: user.user_uuid as string, date: dashboardDate, period }).then((currentDashboard) => {
            if (currentDashboard) {
              setDashboard(currentDashboard)
              setLoading(false)
            }
          }).catch((e: any) => {
            if (e.status === 404) {
              mindumpApi.postDashboard({ user_uuid: user.user_uuid as string, date: dashboardDate, period }).then((newDashboard) => {
                setDashboard(newDashboard)
                setLoading(false)
              })
            }
          })
        } else {
          setLoading(false)
        }
      })
      }
  }


  useEffect(() => {
    loadDashboard()
  }, [user?.user_uuid])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-screen">
      <h1 className="text-xl font-semibold">{t("dashboard.title")}</h1>

      {showDashboard && dashboard ? (
        <>
          <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2 select-none mt-4">{t("dashboard.sections.weekEvolution.title")}</h2>
            <EmotionLineChart dashboard={dashboard} />
          </section>

          <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2 select-none mt-4">{t("dashboard.sections.topKeywords.title")}</h2>
            <div className="flex flex-wrap gap-2">
              {dashboard.keywords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-base font-medium"
                >
                  {titleize(word)}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 select-none mt-4">{t("dashboard.sections.issuesToWork.title")}</h2>
            <div className="flex flex-col gap-3">
              {dashboard.issues && dashboard.issues.length ? (
                dashboard.issues.map((issue, idx) => (
                  <button
                    key={idx}
                    className="p-2 text-left bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm hover:shadow-md transition hover:bg-yellow-100"
                  >
                    <p className="text-base font-medium text-yellow-900">{issue.description}</p>
                  </button>
                ))
              ) : (
                <p className="text-sm font-semibold text-yellow-900">
                  {t("dashboard.sections.issuesToWork.emptyText")}
                </p>
              )}
            </div>
          </section>

          {/* Resumen textual */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2 select-none mt-4">
              {t("diary.summary.title")}
            </h2>
            <p className="text-base leading-relaxed text-gray-700">
              {dashboard.summary}
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center text-center px-6 text-zinc-600">
            <p className="text-lg font-semibold">{t("dashboard.emptyState.title")}</p>
            <p className="text-sm mt-2 max-w-xs">{t("dashboard.emptyState.subtitle")}</p>
          </div>
        </div>
      )}
    </div>
  );
}