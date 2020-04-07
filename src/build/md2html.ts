import unified from 'unified'
import markdown from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import yaml from 'remark-parse-yaml'
import rehype from 'remark-rehype'
import ruby from 'remark-ruby'
import footnotes from 'remark-footnotes'
import stringify from 'rehype-stringify'
import raw from 'rehype-raw'
import format from 'rehype-format'
import { highlight, copyFrontmatter, doc, linkMd2Html } from './remark'
import { code, crossReference, image, footnote } from './rehype'

/**
 * Convert markdown to HTML.
 * @param md Markdown text.
 * @param relativePath Relative path from root directory.
 */
const md2html = (md: string, relativePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(frontmatter, ['yaml', 'toml'])
      .use(yaml)
      .use(copyFrontmatter)
      .use(highlight)
      .use(linkMd2Html)
      .use(ruby)
      .use(footnotes, { inlineNotes: true })
      .use(rehype, {
        allowDangerousHTML: true,
        handlers: {
          code,
          crossReference,
          image,
          footnote,
        },
      })
      .use(doc, { relativePath })
      .use(raw)
      .use(format)
      .use(stringify)
      .process(md, (err, file) => {
        if (err) {
          reject(err)
        } else {
          resolve(String(file))
        }
      })
  })
}

export default md2html
