import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/ash/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate mapbox-gl into its own chunk since it's large and only used in Location component
          'mapbox-gl': ['mapbox-gl'],
          // Separate Vue core into its own chunk
          'vue-vendor': ['vue'],
        },
      },
    },
    // Increase chunk size warning limit since we're code-splitting
    chunkSizeWarningLimit: 600,
  },
})
