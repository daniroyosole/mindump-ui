import axios from "axios";
import type { User, UserContextData } from "contexts/UserContext";

const API_BASE = import.meta.env.VITE_MINDUMP_API_BASE;

export type Message = {
  content: string;
  date?: string;
  user_uuid: string;
  timezone: string;
}

// API Methods
export const mindumpApi = {
  // Autenticación con Google
  async authWithGoogle(token: string) {
    const { data } = await axios.post(`${API_BASE}/auth/google`, {
      token,
    });
    return data;
  },

  // Obtener User
  async getUser(user_uuid: string) {
    const params = new URLSearchParams({ user_uuid });
    const { data } = await axios.get(`${API_BASE}/auth/user?${params.toString()}`);
    return data;
  },

  // Guardar User
  async saveUser(user: User) {
    const { data } = await axios.post(`${API_BASE}/auth/user`, user);
    return data;
  },

   // Creat UserContext
   async createUserContext(userContext: UserContextData) {
    const { data } = await axios.post(`${API_BASE}/user-context`, userContext);
    return data;
  },

  // Guardar UserContext
  async saveUserContext(userContext: UserContextData) {
    const { data } = await axios.put(`${API_BASE}/user-context`, userContext);
    return data;
  },

  // Obtener mensajes
  async getMessages(date: string, user_uuid: string): Promise<Message[]> {
    const params = new URLSearchParams({ user_uuid, min: date ?? "", max: date ?? "" });
    const { data } = await axios.get(`${API_BASE}/messages?${params.toString()}`);
    return data;
  },

  // Enviar mensaje
  async sendMessage(message: Message) {
    const { data } = await axios.post(`${API_BASE}/messages`, {
      content: message.content,
      date: message.date,
      user_uuid: message.user_uuid,
      timezone: message.timezone
    });
    return data;
  },
  // Obtener resumen diario
  async generateSummary(user_uuid: string, date?: string) {
    const { data } = await axios.post(`${API_BASE}/summaries`, { user_uuid, date });
    return data;
  },

  // Obtener resumen diario
  async getSummary(user_uuid: string, date?: string) {
    const params = new URLSearchParams({ user_uuid, min: date ?? "", max: date ?? "" });
    const { data } = await axios.get(`${API_BASE}/summaries?${params.toString()}`);
    return data;
  },

  // Obtener todos los resúmenes de un rango de fechas
  async getSummaries({
    min,
    max,
    user_uuid,
  }: {
    user_uuid: string;
    min: string;
    max: string;
  }) {
    const params = new URLSearchParams({ user_uuid, min, max });
    const { data } = await axios.get(`${API_BASE}/summaries?${params.toString()}`);
    return data;
  },

  // Obtener dashboard por user_uuid, date y period
  async getDashboard({
    user_uuid,
    date,
    period,
  }: {
    user_uuid: string;
    date: string; // yyyy-MM-dd, primera fecha del periodo
    period: "isoWeek" | "month";
  }) {
    const params = new URLSearchParams({ user_uuid, date, period });
    const { data } = await axios.get(`${API_BASE}/dashboards?${params.toString()}`);
    return data;
  },

  // Crear o actualizar dashboard (POST)
  async postDashboard({
    user_uuid,
    date,
    period,
  }: {
    user_uuid: string;
    date: string;
    period: "isoWeek" | "month";
  }) {
    const { data } = await axios.post(`${API_BASE}/dashboards`, {
      user_uuid,
      date,
      period,
    });
    return data;
  },

  async hasSummaryInPeriod({
    user_uuid,
    date,
    period,
  }: {
    user_uuid: string;
    date: string;
    period: "isoWeek" | "month";
  }) {
    const params = new URLSearchParams({ user_uuid, date, period });
    const { data } = await axios.get(`${API_BASE}/summaries/in-period?${params.toString()}`);
    return data;
  },
}