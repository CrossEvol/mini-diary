import { EFormat } from 'ce-shard'
import queryString, { StringifyOptions } from 'query-string'
import { DateTimeFormatEnum, formatDateTime } from 'ce-utils'

export const createTodosQueryKey = (date: Date) => {
  return `todos-${formatDateTime(date, DateTimeFormatEnum.DATE_FORMAT)}`
}

export const createDiaryKey = (userID: number, date: string) =>
  `diary-${userID}-${date}`

export const createDiaryPath = (username: string, date: string) =>
  `diary-${username}-${date}`

export const ApiUrl = (
  route?: string,
  query?: Record<string, any>,
  options?: StringifyOptions
) =>
  `http://localhost:${localStorage.getItem('port') ?? 3000}${!route ? '' : `/${route}`}${!query ? '' : `?${queryString.stringify(query, options)}`}`

export const combineEditorContent = (
  format: EFormat,
  { previous, current }: { previous: string; current: string }
) => {
  if (isSafeEditorContent(format, previous)) {
    return current
  }

  if (isSafeEditorContent(format, current)) {
    return previous
  }

  switch (format) {
    case EFormat.HTML:
      return previous + current
    case EFormat.JSON:
      return JSON.stringify([...JSON.parse(previous), ...JSON.parse(current)])
    case EFormat.MARKDOWN:
      return previous + current
  }
}

const EMPTY_HTML = '(empty HTML)'
const EMPTY_MARKDOWN = '(empty MARKDOWN)'
const EMPTY_JSON = JSON.stringify({ json: '(empty JSON)' })

export const safeEditorContent = (format: EFormat) => {
  switch (format) {
    case EFormat.HTML:
      return EMPTY_HTML
    case EFormat.MARKDOWN:
      return EMPTY_MARKDOWN
    case EFormat.JSON:
      return EMPTY_JSON
  }
}

const isSafeEditorContent = (format: EFormat, content: string) => {
  return (
    (format === EFormat.HTML && content === EMPTY_HTML) ||
    (format === EFormat.MARKDOWN && content === EMPTY_MARKDOWN) ||
    (format === EFormat.JSON && content === EMPTY_JSON)
  )
}
