
import axios from "axios";

export const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;