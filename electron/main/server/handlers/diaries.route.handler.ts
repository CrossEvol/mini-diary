import { createRoute, z } from '@hono/zod-openapi'
import { DateTimeFormatEnum, formatDateTime } from '../../util/datetime.utils'
import {
    createDiary,
    getAllDiaryIDs,
    updateDiary,
} from '../../database/database'
import {
    Diary,
    DiarySync,
    DiarySyncOutput,
    DiarySyncOutputSchema,
    DiarySyncSchema,
    ZResultSchema,
} from '../api.type'
import { HonoApp } from '../hono.app'
import { okResponse } from '../server.aux'

const useDiariesRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'put',
            path: '/diaries',
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: z.array(DiarySyncSchema),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Respond a message',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(DiarySyncOutputSchema),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const diaries = (await c.req.json<DiarySync[]>()).map((d) => ({
                ...d,
                createdAt: formatDateTime(
                    new Date(d.createdAt),
                    DateTimeFormatEnum.DATE_FORMAT
                ),
            }))
            const userID = c.get('userID')
            const diaryIDs = await getAllDiaryIDs(userID)
            const diaryIdMap = diaryIDs.reduce((acc, cur) => {
                acc.set(
                    formatDateTime(
                        cur.createdAt!,
                        DateTimeFormatEnum.DATE_FORMAT
                    ),
                    cur
                )
                return acc
            }, new Map<string, Pick<Diary, 'id' | 'createdAt'>>())
            const existedDates = diaryIDs
                .map((d) => d.createdAt)
                .filter((d) => d !== null)
                .map((e) => formatDateTime(e!, DateTimeFormatEnum.DATE_FORMAT))
            const createdDiaries = await Promise.all(
                diaries
                    .filter((d) => !existedDates.includes(d.createdAt!))
                    .map(
                        async (d) =>
                            await createDiary(
                                userID,
                                d.content,
                                new Date(d.createdAt!)
                            )
                    )
            )
            const updatedDiaries = await Promise.all(
                diaries
                    .filter((d) => existedDates.includes(d.createdAt!))
                    .map(
                        async (d) =>
                            await updateDiary(
                                diaryIdMap.get(d.createdAt!)!.id,
                                d.content
                            )
                    )
            )

            return c.json(
                okResponse<DiarySyncOutput>({
                    createdCount: createdDiaries.length,
                    updatedCount: updatedDiaries.length,
                })
            )
        }
    )
}

export default useDiariesRoute
