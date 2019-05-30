import unified from 'unified'
import markdown from 'remark-parse'
import rehype from 'remark-rehype'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-yaml'
import crossref from '@paperist/remark-crossref'
import ruby from 'remark-ruby'
import stringify from 'rehype-stringify'
import raw from 'rehype-raw'
import format from 'rehype-format'
import { highlight, copyFrontmatter, doc } from './remark'
import { image, crossReference, footnote } from './rehype'

/**
 * Convert markdown to HTML.
 * @param md Markdown text.
 */
const md2html = (md: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(frontmatter, ['yaml', 'toml'])
      .use(parseFrontmatter)
      .use(copyFrontmatter as any)
      .use(highlight as any)
      .use(crossref as any)
      .use(ruby)
      .use(rehype, {
        allowDangerousHTML: true,
        handlers: {
          image,
          crossReference,
          footnote
        }
      })
      .use(doc)
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
