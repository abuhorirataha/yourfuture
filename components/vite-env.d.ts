// vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  // يمكنك إضافة متغيرات VITE_ الأخرى هنا
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}