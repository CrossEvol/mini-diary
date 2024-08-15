import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    rmSync('dist-electron', { recursive: true, force: true })

    const isServe = command === 'serve'
    const isBuild = command === 'build'
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG

    return {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src'),
            },
        },
        build: {
            rollupOptions: {
                input: {
                    main: 'index.html',
                    datePicker: 'date-picker.html',
                    test: 'pages/date-picker/dist/index.html',
                    messageBox: 'pages/imports-diff-box/dist/index.html',
                },
                output: {
                    entryFileNames: '[name].js', // Change JS file name if needed
                    chunkFileNames: 'assets/[name].js',
                    assetFileNames: 'assets/[name][extname]',
                    manualChunks: (id, {}) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('parse5')) return `vendor-parse5`
                            if (id.includes('@mantine')) return `vendor-mantine`
                            if (id.includes('micromark'))
                                return `vendor-micromark`
                            if (id.includes('@popperjs')) return `vendor-popper`
                            if (id.includes('emoji')) return `vendor-emoji`
                            if (id.includes('@tiptap')) return `vendor-tiptap`
                            if (id.includes('prosemirror'))
                                return `vendor-prosemirror`
                            if (id.includes('yjs')) return `vendor-yjs`
                            if (id.includes('hast-util'))
                                return `vendor-hast-util`
                            if (id.includes('mdast-util'))
                                return `vendor-mdast-util`
                            if (id.includes('unist-util'))
                                return `vendor-unist-util`
                            if (id.includes('markdown-it'))
                                return `vendor-markdown-it`
                            if (id.includes('@floating-ui'))
                                return `vendor-floating-ui`
                            if (id.includes('@mui')) return 'vendor-mui'
                            if (id.includes('@blocknote'))
                                return 'vender-block-note'
                            if (id.includes('@emotion')) return 'vendor-emotion'
                            if (id.includes('js-beautify'))
                                return 'vendor-js-beautify'
                            if (id.includes('localforage'))
                                return 'vendor-localforage'
                            if (id.includes('react-toastify'))
                                return 'vendor-react-toastify'
                            if (id.includes('date-fns')) {
                                return 'vendor-date-fns'
                            }
                            if (id.includes('@tanstack')) {
                                return 'vendor-@tanstack'
                            }
                            if (id.includes('@dnd-kit')) {
                                return 'vendor-@dnd-kit'
                            }
                            if (id.includes('react-day-picker')) {
                                return 'vendor-react-day-picker'
                            }
                            if (id.includes('react-calendar'))
                                return 'vendor-react-calendar'
                            return 'vendor'
                        }
                    },
                    paths: {
                        test: 'test.html',
                    },
                },
            },
        },
        plugins: [
            react(),
            visualizer({ open: true, filename: 'ce-stats.html' }),
            electron([
                {
                    // Main-Process entry file of the Electron App.
                    entry: 'electron/main/index.ts',
                    onstart(options) {
                        if (process.env.VSCODE_DEBUG) {
                            console.log(
                                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
                            )
                        } else {
                            options.startup()
                        }
                    },
                    vite: {
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: 'dist-electron/main',
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg
                                        ? pkg.dependencies
                                        : {}
                                ),
                            },
                        },
                    },
                },
                {
                    entry: 'electron/preload/index.ts',
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload()
                    },
                    vite: {
                        build: {
                            sourcemap: sourcemap ? 'inline' : undefined, // #332
                            minify: isBuild,
                            outDir: 'dist-electron/preload',
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg
                                        ? pkg.dependencies
                                        : {}
                                ),
                            },
                        },
                    },
                },
                {
                    entry: 'electron/preload-date-picker/index.ts',
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload()
                    },
                    vite: {
                        build: {
                            sourcemap: sourcemap ? 'inline' : undefined, // #332
                            minify: isBuild,
                            outDir: 'dist-electron/preload-date-picker',
                            rollupOptions: {
                                external: [],
                            },
                        },
                    },
                },
            ]),
            // Use Node.js API in the Renderer-process
            renderer(),
        ],
        server:
            process.env.VSCODE_DEBUG &&
            (() => {
                const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
                return {
                    host: url.hostname,
                    port: +url.port,
                }
            })(),
        clearScreen: false,
    }
})
