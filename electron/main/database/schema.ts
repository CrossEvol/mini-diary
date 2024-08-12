import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(), // 'id' is the column name
    email: text('email').unique(),
    nickname: text('nickname'),
    password: text('password'),
    pinCode: text('pin_code'),
    avatar: text('avatar'),
})

export const diariesTable = sqliteTable('diaries', {
    id: integer('id').primaryKey(), // 'id' is the column name
    ownerId: integer('owner_id')
        .notNull()
        .references(() => usersTable.id),
    content: blob('content', { mode: 'json' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
})

export const projectsTable = sqliteTable('projects', {
    id: integer('id').primaryKey(), // 'id' is the column name
    name: text('name'),
    ownerId: integer('owner_id')
        .notNull()
        .references(() => usersTable.id),
})

export const todosTable = sqliteTable('todos', {
    id: integer('id').primaryKey(),
    text: text('text'),
    status: text('status', { enum: ['PENDING', 'PAUSED', 'COMPLETED'] }),
    deadline: integer('deadline', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
    priority: text('priority', { enum: ['HIGH', 'MEDIUM', 'LOW'] }),
    createdBy: integer('created_by')
        .notNull()
        .references(() => usersTable.id),
})
