import axios from "axios";
import type { User } from "contexts/UserContext";

const API_BASE = "http://localhost:4000"; // Puedes hacer esto dinámico si quieres usar .env
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

  // Obtener entry
  async getEntry(date: string, user_uuid: string) {
    const params = new URLSearchParams({ user_uuid, min: date ?? "", max: date ?? "" });
    const { data } = await axios.get(`${API_BASE}/entries?${params.toString()}`);
    return data;
  },

  // Obtener mensajes
  async getMessages(date: string, user_uuid: string) {
    const params = new URLSearchParams({ user_uuid, min: date ?? "", max: date ?? "" });
    const { data } = await axios.get(`${API_BASE}/messages?${params.toString()}`);
    return data;
  },

  // Enviar mensaje
  async sendMessage({
    content,
    date,
    user_uuid,
  }: {
    content: string;
    date?: string;
    user_uuid: string;
  }) {
    const { data } = await axios.post(`${API_BASE}/messages`, {
      content,
      date,
      user_uuid,
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
}