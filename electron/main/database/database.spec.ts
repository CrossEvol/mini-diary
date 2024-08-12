import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { rmSync } from 'fs'
import { writeFile } from 'fs/promises'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { diariesTable, todosTable, usersTable } from './schema'
import { seed } from './seed'

const testDatabasePath = 'sqlite.test.db'

const sqlite = new Database(testDatabasePath)
const db = drizzle(sqlite)

beforeAll(() => {
    // this will automatically run needed migrations on the database
    migrate(db, { migrationsFolder: './drizzle' })
    seed(db)
})

afterAll(() => {
    sqlite.close()
    rmSync(testDatabasePath, { force: true })
})

describe('databaseTest', () => {
    it('getUsers', () => {
        const res = db.select().from(usersTable).all()
        console.log(res)
    })

    it('getUsersWithDiaries', async () => {
        await db.transaction(async (tx) => {
            const res = tx
                .insert(usersTable)
                .values({
                    email: 'test',
                    nickname: 'test',
                    password: 'abc123',
                    pinCode: '123456',
                })
                .run()
            const userId = res.lastInsertRowid
            tx.insert(diariesTable)
                .values({
                    ownerId: userId as number,
                    content: JSON.stringify({ a: 1, b: '2' }),
                    createdAt: new Date(),
                })
                .run()
            const allUsersWithDiareis = db
                .select()
                .from(usersTable)
                .leftJoin(diariesTable, eq(usersTable.id, diariesTable.ownerId))
                .all()
            console.log(allUsersWithDiareis)

            const diaryRecords = db.select().from(diariesTable).all()
            console.log(diaryRecords)
            console.log(JSON.stringify(diaryRecords[0]))
        })
    })

    it('group by todos by deadline', async () => {
        const records = db.select().from(todosTable).all()

        const todoMap = records.reduce((acc, cur, _idx) => {
            if (acc.has(cur.deadline!.toDateString())) {
                const a = acc.get(cur.deadline!.toDateString())!
                acc.set(cur.deadline!.toDateString(), a.concat(cur))
            } else {
                acc.set(cur.deadline!.toDateString(), [])
            }
            return acc
        }, new Map<string, (typeof records)[0][]>())

        const result = todoMap.entries().reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
        }, Object.create(null))

        await writeFile('todos.json', JSON.stringify(result, null, 2)),
            {
                encoding: 'utf-8',
            }
    })
})
