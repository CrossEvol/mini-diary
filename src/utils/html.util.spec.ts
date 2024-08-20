import { expect, test } from 'vitest'
import { beautifyHtml } from './html.util'

test('beautifies HTML', () => {
  const uglyHtml = `<h1 class="bn-inline-content">fjdsalfdsjflasd<br></h1><ul><li><p class="bn-inline-content">a</p></li><li><p class="bn-inline-content">b</p></li><li><p class="bn-inline-content">c</p></li></ul><p class="bn-inline-content"></p>`

  const beautifiedHtml = beautifyHtml(uglyHtml, { indent_size: 2 })
  console.log(beautifiedHtml)

  expect(beautifiedHtml.length).greaterThan(uglyHtml.length)
})
