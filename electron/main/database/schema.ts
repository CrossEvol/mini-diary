import { sql } from 'drizzle-orm'
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const UsersTable = sqliteTable('users', {
    id: integer('id').primaryKey(), // 'id' is the column name
    email: text('email').unique().notNull(),
    nickname: text('nickname').notNull().default(''),
    password: text('password').notNull().default(''),
    pinCode: text('pin_code').notNull().default(''),
    avatar: text('avatar').notNull().default('/static/go.jpg'),
})

export const DiariesTable = sqliteTable('diaries', {
    id: integer('id').primaryKey(), // 'id' is the column name
    ownerId: integer('owner_id')
        .notNull()
        .references(() => UsersTable.id),
    content: blob('content', { mode: 'json' }).notNull().default(''),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
})

export const ProjectsTable = sqliteTable('projects', {
    id: integer('id').primaryKey(), // 'id' is the column name
    name: text('name').notNull().default(''),
    ownerId: integer('owner_id')
        .notNull()
        .references(() => UsersTable.id),
})

export const TodosTable = sqliteTable('todos', {
    id: integer('id').primaryKey(),
    text: text('text').notNull().default(''),
    remark: text('remark').notNull().default(''),
    status: text('status', {
        enum: ['PENDING', 'PAUSED', 'COMPLETED'],
    })
        .notNull()
        .default('PENDING'),
    deadline: integer('deadline', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    priority: text('priority', { enum: ['HIGH', 'MEDIUM', 'LOW'] })
        .notNull()
        .default('LOW'),
    order: integer('order').notNull().default(0),
    createdBy: integer('created_by')
        .notNull()
        .references(() => UsersTable.id),
})
