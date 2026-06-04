type WindowWithEnv = Window & {
  __ENV?: {
    VITE_BACKEND_URL?: string;
  };
};

const runtimeEnv = (globalThis as unknown as WindowWithEnv).__ENV;

export const API_BASE =
  runtimeEnv?.VITE_BACKEND_URL ||
  (import.meta as any).env?.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8004";
