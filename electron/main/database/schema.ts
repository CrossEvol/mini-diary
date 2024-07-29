import {
	blob,
	integer,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(), // 'id' is the column name
    nickName: text('nickname'),
    password: text('password'),
    pinCode: text('pin_code'),
})

export const diaries = sqliteTable('diaries', {
    id: integer('id').primaryKey(), // 'id' is the column name
    ownerId: integer('owner_id')
        .notNull()
        .references(() => users.id),
    content: blob('content', { mode: 'json' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }),
})

export const projects = sqliteTable('projects', {
    id: integer('id').primaryKey(), // 'id' is the column name
    name: text('name'),
    ownerId: integer('owner_id')
        .notNull()
        .references(() => users.id),
})
