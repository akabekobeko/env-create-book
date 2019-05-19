import unified from 'unified'
import pug from 'pug'

const mdProcessor = unified()

/**
 * const mdProcessor = unified()
  .use(parse, latexPlugins.settings)
  .use(frontmatter, ['yaml', 'toml'])
  .use(highlight)
  // .use(config)
  .use(slugger)
  // .use(footnote)
  .use(ruby)
  .use(crossref)
  // .use(latexPlugins.plugins.MathPlugin)
  // .use(latexPlugins.plugins.TableCaptionPlugin)
  .use(mark2hype, {
    allowDangerousHTML: true,
    handlers: {
      footnote: footnoteHandler,
      ruby: rubyHandler,
      crossReference: crossReferenceHandler,
      image: imageHandler,
    },
  })
  .use(raw)
  .use(format)
  .use(stringify)
  .freeze();
 */

console.log('e-book!')
