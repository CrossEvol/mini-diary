import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import useProfile from '@/hooks/useProfile'
import {
    compareDate,
    DateTimeFormatEnum,
    formatDateTime
} from '@/utils/datetime.utils'
import Fuse from 'fuse.js'
import { useAtom } from 'jotai'
import localforage from 'localforage'
import * as React from 'react'
import { SearchResultEntry } from '../layouts/editor-layout'
import SearchItem from './search-item'

export type MarkdownEntry = {
    date: string
    mdText: string
}

interface IProps {
    q: string
}

export default function SearchResult({ q }: IProps) {
    const [ee] = useAtom(eventEmitterAtom)
    const { profile } = useProfile()
    const { loadContent } = useEditorStorage()
    const [markdownEntries, setMarkdownEntries] = React.useState<
        MarkdownEntry[]
    >([])
    const [expanded, setExpanded] = React.useState<string | false>(
        formatDateTime(new Date(), DateTimeFormatEnum.DATE_FORMAT)
    )

    const handleExpandedChange =
        (panel: string) =>
        (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false)
        }

    const search = async (q: string) => {
        const loadedContents = (await Promise.all(
            (await localforage.keys())
                .filter((key) => key.startsWith(`diary-${profile?.id}`))
                .map(async (key) => ({
                    diaryKey: key,
                    diaryValue: await loadContent(key),
                }))
        )) satisfies SearchResultEntry[]

        const options = {
            includeScore: true,
            keys: [
                ['diaryValue', 'content', 'text'],
                ['diaryValue', 'content', 'rows', 'cells', 'text'], // can not be searched, cells are [[{}],[{}]]
                ['diaryValue', 'children', 'content', 'text'],
            ],
        }

        const fuse = new Fuse(loadedContents, options)

        const results = fuse.search(q)
        // console.log(results)
        ee.once(EmitterEvent.RETURN_MARKDOWN_FROM_BLOCKS, (entries: MarkdownEntry[]) => {
            setMarkdownEntries(
                entries.sort((a, b) => compareDate(a.date, b.date))
            )
        })
        ee.emit(
            EmitterEvent.SEND_BLOCKS_TO_EDITOR,
            results.map((result) => result.item)
        )
    }

    React.useEffect(() => {
        search(q)
        return () => {}
    }, [q])

    React.useEffect(() => {
        console.log(markdownEntries)
        return () => {}
    }, [markdownEntries])

    return (
        <div>
            {markdownEntries.length > 0 ? (
                markdownEntries.map((entry) => (
                    <SearchItem
                        key={entry.date}
                        markdownEntry={entry}
                        expanded={expanded}
                        handleExpandedChange={handleExpandedChange}
                    />
                ))
            ) : (
                <div> No Result.</div>
            )}
        </div>
    )
}
