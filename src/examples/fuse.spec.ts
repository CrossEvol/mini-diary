import Fuse from 'fuse.js'
import { describe, expect, test } from 'vitest'

describe('fuse.js examples', () => {
    test('fuse.js getFn test', () => {
        const list = [
            {
                title: "Old Man's War",
                author: {
                    name: 'John Scalzi',
                    tags: [
                        {
                            value: 'American',
                        },
                    ],
                },
            },
            {
                title: 'The Lock Artist',
                author: {
                    name: 'Steve Hamilton',
                    tags: [
                        {
                            value: 'English',
                        },
                    ],
                },
            },
        ]

        type Book = (typeof list)[number]

        const options = {
            includeScore: true,
            keys: [
                { name: 'title', getFn: (book: Book) => book.title },
                { name: 'authorName', getFn: (book: Book) => book.author.name },
            ],
        }

        const fuse = new Fuse(list, options)

        const result = fuse.search({ authorName: 'Steve' })

        console.log(JSON.stringify(result, null, 2))
        expect(result.length).gt(0)
    })

    test('fuse.js array notation test', () => {
        const list = [
            {
                id: '8f62e9eb-675f-4734-bed2-6807a0ca3842',
                type: 'table',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                },
                content: {
                    type: 'tableContent',
                    rows: [
                        {
                            cells: [
                                [
                                    {
                                        type: 'text',
                                        text: 'hello',
                                        styles: {},
                                    },
                                ],
                                [
                                    {
                                        type: 'text',
                                        text: 'b',
                                        styles: {},
                                    },
                                ],
                                [
                                    {
                                        type: 'text',
                                        text: 'c',
                                        styles: {},
                                    },
                                ],
                            ],
                        },
                    ],
                },
                children: [],
            },
            {
                id: 'ae267682-7325-4987-b7a8-1f021041384a',
                type: 'numberedListItem',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                    textAlignment: 'left',
                },
                content: [
                    {
                        type: 'text',
                        text: 'Numbered List',
                        styles: {},
                    },
                ],
                children: [
                    {
                        id: '41f00347-ee78-4f32-b335-08b67b172101',
                        type: 'numberedListItem',
                        props: {
                            textColor: 'default',
                            backgroundColor: 'default',
                            textAlignment: 'left',
                        },
                        content: [
                            {
                                type: 'text',
                                text: 'sub list hello',
                                styles: {},
                            },
                        ],
                        children: [],
                    },
                ],
            },
            {
                id: '5a3846f9-39f6-48f4-8568-4db57830ebdb',
                type: 'heading',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                    textAlignment: 'left',
                    level: 1,
                },
                content: [
                    {
                        type: 'text',
                        text: 'hello;\n',
                        styles: {},
                    },
                ],
                children: [],
            },
            {
                id: 'a07507e3-41c9-4e61-942f-1d1391bc6afc',
                type: 'paragraph',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                    textAlignment: 'left',
                },
                content: [
                    {
                        type: 'text',
                        text: 'world💕 \n⛴️ \n',
                        styles: {},
                    },
                ],
                children: [],
            },
        ]

        const options = {
            includeScore: true,
            keys: [
                ['content', 'text'],
                ['content', 'rows', 'cells', 'text'], // can not be searched, cells are [[{}],[{}]]
                ['children', 'content', 'text'],
            ],
        }

        const fuse = new Fuse(list, options)

        const result = fuse.search('hello')
        expect(result.length).toBe(2)
        console.log(JSON.stringify(result, null, 2))
    })
})
