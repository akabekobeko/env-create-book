import refractor from 'refractor'
import visit from 'unist-util-visit'

/**
 * Highlighting the `code` block contained in Markdown.
 */
const highlight = () => (tree: any) => {
  visit(tree, 'code', (node: any) => {
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

export default highlight
