import {defineConfig} from 'vite'
import path from 'path'
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        minify: 'esbuild', // Use esbuild for minification (default)
        assetsDir: 'assets',
        rollupOptions: {
            input: path.resolve(__dirname, 'src/index.html'),
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]' // Hashing for cache busting
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // Optional alias for cleaner imports
        }
    },
    define: {
        'process.env.NODE_ENV': '"production"' // Inject environment variables
    }
})