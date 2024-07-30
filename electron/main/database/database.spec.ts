import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { diariesTable, usersTable } from './schema'

const sqlite = new Database('./sqlite.db')
const db = drizzle(sqlite)

beforeAll(() => {})

afterAll(() => {})

describe('a', () => {
    it('a1', async () => {
        await db.transaction(async (tx) => {
            const res = tx
                .insert(usersTable)
                .values({
                    nickName: 'test',
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
})
