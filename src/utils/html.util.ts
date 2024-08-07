import * as beautify from 'js-beautify'

export const beautifyHtml = (
    html: string,
    options?: beautify.HTMLBeautifyOptions
) => {
    return beautify.html(html, options)
}
