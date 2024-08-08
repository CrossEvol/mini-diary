import { EFormat } from '@/shared/enums'
import { Parser } from 'htmlparser2'
import JSON5 from 'json5'
import MarkdownIt from 'markdown-it'

// Function to check if content is Markdown
const isMarkdown = (content: string): boolean => {
    const md = new MarkdownIt()
    const rendered = md.render(content)
    return rendered.includes('<p>') || rendered.includes('<h1>')
}

// Function to check if content is HTML
const isHTML = (content: string): boolean => {
    let isValidHTML = false
    const parser = new Parser({
        onopentagname() {
            isValidHTML = true
        },
    })
    parser.write(content)
    parser.end()
    return isValidHTML
}

// Function to check if content is JSON
const isJSON = (content: string): boolean => {
    try {
        JSON5.parse(content)
        return true
    } catch (e) {
        return false
    }
}

export const verifyContentFormat = (content: string): string => {
    if (isJSON(content)) {
        return EFormat.JSON
    } else if (isHTML(content)) {
        return EFormat.HTML
    } else if (isMarkdown(content)) {
        return EFormat.MARKDOWN
    } else {
        return EFormat.MARKDOWN
    }
}
