import Database from 'better-sqlite3'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { diaries, users } from './schema'

const sqlite = new Database('./sqlite.db')
const db = drizzle(sqlite)

beforeAll(() => {})

afterAll(() => {})

describe('a', () => {
    it('a1', async () => {
        await db.transaction(async (tx) => {
            const res = tx
                .insert(users)
                .values({
                    nickName: 'test',
                    password: 'abc123',
                    pinCode: '123456',
                })
                .run()
            const userId = res.lastInsertRowid
            tx.insert(diaries)
                .values({
                    ownerId: userId as number,
                    content: JSON.stringify({ a: 1, b: '2' }),
                    createdAt: new Date(),
                })
                .run()
            const allUsersWithDiareis = db
                .select()
                .from(users)
                .leftJoin(diaries, eq(users.id, diaries.ownerId))
                .all()
            console.log(allUsersWithDiareis)

            const diaryRecords = db.select().from(diaries).all()
            console.log(diaryRecords)
            console.log(JSON.stringify(diaryRecords[0]))
        })
    })
})
