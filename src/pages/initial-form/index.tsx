import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, type UserContextData } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import i18n from 'i18next';
import { DESCRIPTION_OPTIONS } from "./descriptionOptions";

const steps: string[] = ["language", "age", "timezone", "job", "hobbies", "description", "app_usage"];

const usageOptions = [
  "diary",
  "selfDiscovery",
  "therapySupport",
  "casual",
  "think",
  "awful",
];

const getColorsFromGroups = (group: string) => {
  if (group === "lifestyle") return "bg-purple-100"
  if (group === "personality") return "bg-blue-100"
  if (group === "feelings") return "bg-pink-100"
}

export default function InitialForm() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState<UserContextData>({
    timezone: dayjs.tz.guess()
  });
  const [step, setStep] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const isContextMissing = !user.context || Object.values(user.context).some(value => !value)
  const isAllContextMissing = !user.context || Object.values({ ...user.context, user_uuid: "" }).every(value => !value)
  const { t } = useTranslation()

  const navigateToRightPlace = () => {
    if (user.user_uuid) {
      if (!isContextMissing) {
        navigate("/diary")
      }  else {
        setForm({
          ...form,
          app_usage: (user.context?.app_usage?.split(" // ") || []) as any,
          user_uuid: user.user_uuid
        })
      }
    }
  }

  useEffect(() => {
    if (form.language) {
      i18n.changeLanguage(form.language);
    }
  }, [form.language])

  useEffect(() => {
    navigateToRightPlace()
  }, [user.context, user.user_uuid]);

  useEffect(() => {
    navigateToRightPlace()
  }, [])

  const handleChange = (key: keyof typeof form, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (user.context) {
      const stepKey = steps[step] as keyof UserContextData;
      const currentStepValue = user.context[stepKey];
      if (currentStepValue) {
        next();
      }
    }
  }, [user.context, step])

  const next = () => {
    if (step < steps.length - 1)  {
      if (user.context) {
        const nextStep = steps.findIndex((key, index) => index > step && (!user.context || !user.context[key as keyof UserContextData]))
        setStep(nextStep === -1 ? steps.length - 1 : nextStep);
      } else {
        setStep(step + 1);
      }
    }
  };

  const back = () => {
    if (step > 0)  {
      if (user.context) {
        const nextStep = steps.findIndex((key, index) => index < step && (!user.context || !user.context[key as keyof UserContextData]))
        setStep(nextStep === -1 ? step : nextStep);
      } else {
        setStep(step - 1);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const fixedForm: UserContextData = {
      ...form,
      app_usage: Array.from(form.app_usage || []).join(" // ")
    }
    
    if (isAllContextMissing) {
      await mindumpApi.createUserContext(fixedForm);
    } else {
      await mindumpApi.saveUserContext(fixedForm);
    }
    updateUser({ user_uuid: user.user_uuid, context: fixedForm });
    navigate("/diary");
  };

  const toggleOption = (option: string) => {
    const selected = form.description?.includes(option)
      ? form.description.split(", ").filter(o => o !== option).join(", ")
      : [...(form.description?.split(", ") || []), option].join(", ");
  
    handleChange("description", selected);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white transition">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        {step === 0 && (
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-3">🌍 {t("form.language.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.language.description")}</p>
            <select
              className="w-full border rounded-lg p-2 text-center"
              value={form.language || ""}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option value="" disabled hidden></option>
              <option value="ca">{t("form.language.options.ca")}</option>
              <option value="es">{t("form.language.options.es")}</option>
              <option value="en">{t("form.language.options.en")}</option>
            </select>
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.age.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.age.description")}</p>
            <input
              type="number"
              min={18}
              className="w-full border rounded-lg p-2"
              value={form.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder={t("form.age.placeholder")}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.timezone.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.timezone.description")}</p>
            <select
              className="w-full border rounded-lg p-2"
              value={form.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
            >
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.job.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.job.description")}</p>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={form.job}
              onChange={(e) => handleChange("job", e.target.value)}
              placeholder={t("form.job.placeholder")}
            />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.hobbies.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.hobbies.description")}</p>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={form.hobbies}
              onChange={(e) => handleChange("hobbies", e.target.value)}
              placeholder={t("form.hobbies.placeholder")}
            />
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.description.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.description.description")}</p>

            {/* Opciones clicables */}
            <div className="flex flex-wrap gap-2 mb-4">
              {DESCRIPTION_OPTIONS(form.language || user.language).map((group) => (
                group.items.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`
                      px-3 py-1 rounded-full border
                      text-sm transition
                      ${
                        form.description?.includes(option)
                          ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                          : `${getColorsFromGroups(group.group)} text-gray-500`
                      }
                    `}
                  >
                    {option}
                  </button>
                ))
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="text-xl font-semibold mb-2">{t("form.app_usage.title")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("form.app_usage.description")}</p>
            <div className="flex flex-col gap-2">
              {usageOptions.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.app_usage?.includes(option)}
                    onChange={(e) => {
                      const newSet = e.target.checked
                        ? [...(form.app_usage || []), option]
                        : ((form.app_usage || []) as string[]).filter(o => o !== option);
                      handleChange("app_usage", newSet);
                    }}
                  />
                  {t(`form.app_usage.options.${option}`)}
                </label>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-between">
          {step > 0 ? (
            <button onClick={back}>{t("form.buttons.back")}</button>
          ) : <div />}

          {step < steps.length - 1 ? (
            <button onClick={next} disabled={!form[steps[step] as keyof UserContextData]}>
              {t("form.buttons.next")}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !form.app_usage?.length}>
              {t("form.buttons.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}