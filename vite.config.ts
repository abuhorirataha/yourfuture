import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // تحميل جميع متغيرات البيئة بما في ذلك المتغيرات التي لا تبدأ بـ VITE_
    const env = loadEnv(mode, '.', '');

    return {
        // [1] تصحيح المسار الأساسي لـ GitHub Pages
        base: '/yourfuture/', 
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        // [2] إزالة تعريفات define، والاعتماد على import.meta.env
        // Vite يقوم بدمج متغيرات VITE_ تلقائياً (وهو ما تم تصحيحه في .env.local)
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});