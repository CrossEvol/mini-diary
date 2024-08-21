## What is 
this repo use the pnpm monorepo.
it consist of the code for the main window in the root <br/>
the code for sub window in `pages` <br/>
some shared code in `packages` <br/>

the project structure is decided by [electron-vite-react](https://github.com/electron-vite/electron-vite-react) <br/>
use the [block-note](https://github.com/TypeCellOS/BlockNote) as the rich-text-editor. <br/>
use the [drizzle-orm](https://orm.drizzle.team/) to interact with the sqlite <br/>
can run the [hono-server](https://hono.dev/docs/) in the service_workers(the author is too lazy to migrate) <br/>

## Getting Started

### Install

#### Install dependencies.

```bash
pnpm install
```
maybe the sub project under `packages` and `pages` need run this command 

#### Build sub projects

Build the `packages` and `pages`
```bash
pnpm run build:packages
```

```bash
pnpm run build:pages
```

#### Initialize the drizzle
initialize the orm
```bash
pnpm run generate
```
```bash
pnpm run migrate 
```

`better-sqlite3` uses a nodejs version which is different from yours electron environment, you can 
```bash
pnpm run rebuild 
```
to rebuild the `better-sqlite3` for the compatible version with electron <br/>
if you want to restore the `better-sqlite3` to the origin version , you can run  
```bash
pnpm run reset
```

### generate key-pairs
```bash
pnpm run key:gen
```

#### Run
```bash
pnpm run dev
```

### Lint

```bash
pnpm run lint
```

### Typecheck

```bash
pnpm run typecheck
```

### Build

```bash
pnpm run build
```
use `rollup-plugin-visualizer` analyze the size of dependency and optimize the bundle chunk.

then you can find the release application and installation executable in the `release`

## Source
[electron-vite-react](https://github.com/electron-vite/electron-vite-react)
[electron-react-vite-starter](https://github.com/CrossEvol/electron-react-vite-starter)
[samuelmeuli/mini-diary](https://github.com/CrossEvol/mini-diary)

## Stack List

This project uses many tools like:

client:
- [Vite](https://vitejs.dev)
- [ReactJS](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org)
- [Vitest](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Tailwindcss](https://tailwindcss.com)
- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)
- [mui](https://mui.com/material-ui/getting-started/)
- [shadcn-ui](https://ui.shadcn.com/)
- [react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [tiptap](https://github.com/ueberdosis/tiptap)
- [BlockNote](https://github.com/TypeCellOS/BlockNote)
- [react-hook-form](https://react-hook-form.com/)
- [dndkit](https://docs.dndkit.com/)

backend:
- [hono](https://hono.dev/docs/)
- [drizzle-orm](https://orm.drizzle.team/)
- [electron](https://www.electronjs.org/)
- [winston](https://github.com/winstonjs/winston#readme)

## References
[integrate-hono-with-openapi](https://dev.to/bimaadi/integrate-hono-with-openapiswagger-3dem)
[create-a-monorepo-using-pnpm-workspace](https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn)
[managing-full-stack-monorepo-pnpm](https://blog.logrocket.com/managing-full-stack-monorepo-pnpm/#create-root-project)
[pnpm-workspace-examples](https://github.com/ashleydavis/pnpm-workspace-examples)

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

## Q & A
### run in service_worker
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