import u from 'unist-builder'
import all from 'mdast-util-to-hast'

/**
 * Process `code` on `remark-rehype`.
 * `mdast-util-to-hast` By default, the language is not specified as `<pre>`, so it is handled independently.
 * @param h Processer of HAST.
 * @param node Node of HAST.
 * @returns HAST.
 * @see https://github.com/syntax-tree/mdast-util-to-hast/blob/master/lib/handlers/code.js
 */
export const code = (h: any, node: any) => {
  const value = node.value ? `${node.value}\\n` : ''
  const lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)

  if (lang) {
    // `Prism.js` also requires language specification for `<pre>`
    const props = { className: ['language-' + lang] }
    return h(node.position, 'pre', props, [
      h(node, 'code', props, [u('text', value)])
    ])
  } else {
    return h(node.position, 'pre', [h(node, 'code', {}, [u('text', value)])])
  }
}

/**
 * Process `crossref` on `remark-rehype`..
 * @param h Processer of HAST.
 * @param node Node of HAST.
 * @returns HAST.
 */
export const crossReference = (h: any, node: any) => {
  return node.identifiers
    .map((ident: string) => /^(\w+):(\S+)$/.exec(ident))
    .filter((match: string[]) => match)
    .map((match: string[]) =>
      h(
        node,
        'a',
        {
          href: `#${match[2]}`,
          className: 'crossref',
          'data-ref': match[1]
        },
        []
      )
    )
}

/**
 * Process `foornote` on `remark-rehype`..
 * @param h Processer of HAST.
 * @param node Node of HAST.
 * @returns HAST.
 */
export const footnote = (h: any, node: any) => {
  return h(node, 'span', { className: ['footnote'] }, all(h, node))
}

/**
 * Process `image` on `remark-rehype`..
 * @param h Processer of HAST.
 * @param node Node of HAST.
 * @returns HAST.
 */
export const image = (h: any, node: any) => {
  const props = { src: node.url, alt: node.alt, title: undefined }
  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  const children = [h(node, 'img', props)]
  if (props.alt) {
    children.push(
      h(node, 'figcaption', { className: ['fig'] }, [u('text', props.alt)])
    )
  }

  return h(node, 'figure', null, children)
}
