import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Inject version & timestamp as a <script> that writes window globals and logs them
    {
      name: 'build-info-logger',
      transformIndexHtml(html) {
        const version = JSON.stringify(process.env.npm_package_version || '1.0.0')
        const timestamp = JSON.stringify(new Date().toISOString())
        return html.replace(
          '</head>',
          `<script>
            window.__APP_VERSION__ = ${version};
            window.__BUILD_TIMESTAMP__ = ${timestamp};
            console.log(
              '%c🚀 Sajilo %c v' + window.__APP_VERSION__ + ' %cbuilt at ' + window.__BUILD_TIMESTAMP__,
              'font-weight:bold;color:#1A56DB;', 'color:inherit;', 'color:#999;font-size:0.9em;'
            );
          </script></head>`
        )
      }
    }
  ],
  define: {
    // Also expose them as compile‑time constants for the app code (optional)
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
})