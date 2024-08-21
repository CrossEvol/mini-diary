## 来源
https://github.com/electron-vite/electron-vite-react

[integrate-hono-with-openapiswagger-3dem](https://dev.to/bimaadi/integrate-hono-with-openapiswagger-3dem)

## Todo
- √ remove <Counter> and <Len>
- √ optimize the <Home> , should have LinkButton to latest diary and today's diary.
- √ add navigation after sign-in success and sign-up success.
- √ add reset button for diary editor.
- √ supplement <Profile>, implement the uploading feature.
- √ confirm dialog for import in sub window
- √ import all (verify all, tell about how they are differed, and use the modal for confirmation)
- √ can I use a simple *.html as the messageBox? so can I send message directly to sub window?
- √ when import, can choose combine content or override.
- √ complete <Todo>
- √ Use the dnd-kit to operate the Todo Groups.
- √ solve the re-render-too-many problems in <TodoView/>
- √ Highlight search text for *Todos*
- √ add fuse query for *Diaries*
- √ complete <Settings>
- √ add support for eslint and prettier.
- √ complete the <HomeView/>
- √ update any starter , includes electron, electron-sub-page, mui-vite .


## 打包
`rollup-plugin-visualizer` analyze the size of dependency and optimize the bundle chunk.

## run service_worker
`vite.config.ts`
```ts
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
        input: {
            index: 'electron/main/index.ts',
            'schedule-worker':
                'electron/main/workers/schedule-worker.ts',
        }
    },
},
```
`run-worker`
```ts
import path from 'node:path'
import { Worker } from 'node:worker_threads'

export const startScheduleWorker = () => {
    const worker = new Worker(
        path.resolve(__dirname, 'schedule-worker.js')
    )

    worker.on('message', (message) => {})
    worker.on('error', (err) => {
        console.error('Worker thread error:', err)
    })
    worker.on('exit', (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`)
    })
}

```