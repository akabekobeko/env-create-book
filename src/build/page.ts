import h from 'hastscript'
import u from 'unist-builder'

/**
 * Metadata from Markdown YAML.
 */
type Metadata = {
  /** Title of page. */
  title?: string
  /** Type of page. `'toc'` or `undefined`. */
  type?: string
}

/**
 * Generate a HAST (html) for content page.
 * @param head `<head>` tag.
 * @param body Content in `<body>` tag.
 * @param meta Metadata from Markdown YAML.
 * @returns HAST.
 */
const content = (head: any, body: any, meta: Metadata) => {
  if (meta.title) {
    head.push(h('title', [meta.title]))
    body.unshift(h('h1', [meta.title]))
  }

  return u('root', [
    u('doctype', { name: 'html' }),
    h('html', { lang: 'ja' }, [
      h('head', head),
      h('body', { role: 'doc-chapter' }, [h('article', body)])
    ])
  ])
}

/**
 * Generate a HAST (html) for TOC page.
 * @param head `<head>` tag.
 * @param body Content in `<body>` tag.
 * @param meta Metadata from Markdown YAML.
 * @returns HAST.
 */
const toc = (head: any, body: any, meta: Metadata = {}) => {
  if (meta.title) {
    head.push(h('title', [meta.title]))
  }

  const cover = []
  const toc = []
  for (const value of body) {
    if (value.type === 'element' && value.tagName === 'ul') {
      toc.push(h('nav', { id: 'toc', role: 'doc-toc' }, value))
    } else {
      cover.push(value)
    }
  }

  const content = [h('section', { id: 'cover', role: 'doc-cover' }, cover), toc]

  return u('root', [
    u('doctype', { name: 'html' }),
    h('html', { lang: 'ja' }, [
      h('head', head),
      h('body', { role: 'doc-chapter' }, [h('article', content)])
    ])
  ])
}

/**
 * Generate a HAST (html) for page.
 * @param head `<head>` tag.
 * @param body Content in `<body>` tag.
 * @param meta Metadata from Markdown YAML.
 * @returns HAST.
 */
const page = (head: any, body: any, meta: Metadata) => {
  switch (meta.type) {
    case 'toc':
      return toc(head, body, meta)
    default:
      return content(head, body, meta)
  }
}

export default page
