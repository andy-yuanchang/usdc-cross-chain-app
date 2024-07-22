/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WALLET_CONNECT_PROJECT_ID: string
  readonly IRIS_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}