import path from 'path'
import refractor from 'refractor'
import visit from 'unist-util-visit'
import h from 'hastscript'
import page from './page'

/**
 * Highlighting the `code` block contained in Markdown.
 */
export const highlight = () => (node: any) => {
  visit(node, 'code', (node: any) => {
    let { lang, data, value } = node
    if (!lang || !refractor.registered(lang)) {
      return
    }

    if (!data) {
      data = {}
      node.data = data
    }

    if (!data.hProperties) {
      data.hProperties = {}
    }

    data.hChildren = refractor.highlight(value, lang)
    data.hProperties.className = [
      ...(data.hProperties.className || []),
      `language-${lang}`
    ]
  })
}

/**
 * Copy the `remark-parse-yaml` analysis result to `VFile.data.frontmatter`.
 * The copied data can be referenced from later processing.
 */
export const copyFrontmatter = () => (node: any, file: any) => {
  visit(node, 'yaml', (item: any) => {
    file.data.frontmatter = item.data.parsedValue
  })
}

/**
 * Combines metadata and HAST to generate a page HAST.
 * The metadata is the YAML parsed in Markdown by `remark-frontmatter` and` remark-parse-yaml`.
 * @param options Options.
 * @returns HAST.
 * @see https://github.com/rehypejs/rehype-document
 */
export const doc = (options: { relativePath: string }) => (
  node: any,
  file: any
) => {
  const head = [
    h('meta', { charset: 'utf-8' }),
    h('meta', { name: 'viewport', content: 'width=s, initial-scale=1.0' }),
    h('meta', { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' }),
    h('link', {
      rel: 'stylesheet',
      href: path.join(options.relativePath, 'bundle.css')
    })
  ]

  return page(head, node.children.concat(), file.data.frontmatter)
}
