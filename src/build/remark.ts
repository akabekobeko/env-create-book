import refractor from 'refractor'
import visit from 'unist-util-visit'
import u from 'unist-builder'
import h from 'hastscript'

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

export const copyFrontmatter = () => (node: any, file: any) => {
  visit(node, 'yaml', (item: any) => {
    file.data.frontmatter = item.data.parsedValue
  })
}

/**
 * Combines metadata and HAST to generate a page HAST.
 * The metadata is the YAML parsed in Markdown by `remark-frontmatter` and` remark-parse-yaml`.
 * @see https://github.com/rehypejs/rehype-document
 */
export const doc = () => (node: any, file: any) => {
  const head = [
    h('meta', { charset: 'utf-8' }),
    h('meta', { name: 'viewport', content: 'width=s, initial-scale=1.0' }),
    h('meta', { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' })
  ]

  const body = node.children.concat()
  const title = file.data.frontmatter ? file.data.frontmatter.title : undefined

  if (title) {
    head.push(h('title', [title]))
    body.unshift(h('h1', [title]))
  }

  head.push(h('link', { rel: 'stylesheet', href: 'main.css' }))

  return u('root', [
    u('doctype', { name: 'html' }),
    h('html', { lang: 'ja' }, [
      h('head', head),
      h('article', [h('body', body)])
    ])
  ])
}
