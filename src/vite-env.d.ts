/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONNECTIONS_CONFIG_DIR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
