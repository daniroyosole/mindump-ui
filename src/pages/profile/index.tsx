import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const { user, logout } = useUser()

  const openLanguageModal = () => {
    setSelectedLanguage(i18n.language);
    setShowLanguageModal(true);
  };

  const handleLanguageChange = (e: any) => {
    setSelectedLanguage(e.target.value);
  };

  const confirmLanguageChange = () => {
    setLoading(true)

    mindumpApi.saveUserContext({ user_uuid: user.user_uuid, language: selectedLanguage }).then(() => {
      i18n.changeLanguage(selectedLanguage);
      setShowLanguageModal(false);
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 via-white to-purple-50 px-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">{t("profile.title")}</h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={openLanguageModal}
          className="w-full bg-orange-400 text-white py-3 rounded-full font-medium shadow hover:bg-orange-500 transition"
        >
          {t("profile.changeLanguage")}
        </button>

        <button
          onClick={() => setShowInfo(true)}
          className="w-full border border-orange-300 text-orange-600 py-3 rounded-full font-medium shadow-sm hover:bg-orange-100 transition"
        >
          {t("profile.aboutApp.title")}
        </button>

        <button
          onClick={logout}
          className="w-full bg-orange-400 text-white py-3 rounded-full font-medium shadow hover:bg-orange-500 transition"
        >
          {t("profile.logout")}
        </button>
      </div>

      {/* Modal de información */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-gray-800 mb-2">
              {t("profile.aboutApp.title")}
            </DialogTitle>
            <Description
                className="text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("profile.aboutApp.content") }}
            />


            <div className="mt-6">
              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-orange-400 text-white py-2 rounded-full font-medium shadow hover:bg-orange-500 transition"
              >
                {t("common.close")}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Modal selección idioma */}
      <Dialog open={showLanguageModal} onClose={() => setShowLanguageModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-6">
          <DialogPanel className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold text-gray-800 mb-4">
              {t("form.language.title")}
            </DialogTitle>

            <p className="text-sm text-gray-500 mb-4">{t("form.language.description")}</p>

            <select
              className="w-full border rounded-lg p-2 text-center mb-6"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="ca">{t("form.language.options.ca")}</option>
              <option value="es">{t("form.language.options.es")}</option>
              <option value="en">{t("form.language.options.en")}</option>
            </select>

            <button
              onClick={confirmLanguageChange}
              disabled={loading}
              className={`w-full py-2 rounded-full font-medium shadow mb-3 transition ${
                loading
                  ? "bg-orange-300 text-white cursor-not-allowed"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            >
              {t("common.confirm")}
            </button>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full border border-orange-300 text-orange-600 py-2 rounded-full font-medium shadow-sm hover:bg-orange-100 transition"
            >
              {t("common.cancel")}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
