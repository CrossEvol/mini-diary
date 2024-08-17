import Fuse from 'fuse.js'
import { expect, test } from 'vitest'

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

test('a', () => {
    const fuse = new Fuse(list, options)

    const result = fuse.search({ authorName: 'Steve' })

    console.log(JSON.stringify(result, null, 2))
    expect(result.length).gt(0)
})
