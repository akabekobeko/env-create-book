import u from 'unist-builder'
import all from 'mdast-util-to-hast'

/**
 * Process image tags on `remark-rehype`..
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

/**
 * Process crossref class on `remark-rehype`..
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
 * Process foornote class on `remark-rehype`..
 * @param h Processer of HAST.
 * @param node Node of HAST.
 * @returns HAST.
 */
export const footnote = (h: any, node: any) => {
  return h(node, 'span', { className: ['footnote'] }, all(h, node))
}
