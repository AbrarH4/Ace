declare global {
  interface ImportMetaEnv {
    readonly DEV: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const API_URL = import.meta.env.DEV ? "http://localhost:8000" : "/api";
