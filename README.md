# env-create-book

Environment of create a book with [Vivliostyle.js](https://github.com/vivliostyle/vivliostyle.js) and [vivliostyle-savepdf](https://github.com/vivliostyle/vivliostyle-savepdf).

## Install

1. `git clone https://github.com/akabekobeko/env-create-book`
2. `cd env-create-book`
3. `npm i`

## Usage

### Build

Run `npm run build` to build a PDF with **Vivliostyle.js** and **vivliostyle-savepdf**. The built PDF will be output as `output.pdf` in the project root directory.

### Watch & Preview

Execute `npm start` for the mode of **HTML/CSS** conversion automatically when **Markdown/SCSS** change is detected, and preview. Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to abort.

To run watch and preview separately, use `npm run watch` and `npm run preview`.

## Writing content

Start writing by putting `index.md` in the `src/content` directory. Define the page metadata at the top of the Markdown.

```markdown
---
title: 'My Book'
author: ['Author']
type: 'toc'
---

# Create Book

Cover page

- [Sample](page.html)
- [Sample 2](sub/sample.html)
```

Other pages are not limited except metadata YAML.

```markdown
---
title: 'My Page'
author: ['Author']
type: 'page'
---

# My Page

A very interesting sentence.
```

### Metadata

The metadata at the top of the page is in [YAML](https://yaml.org/) format. Currently supports the following:

| Property | Type       | Value                                                                                                                                                                                                                                          |
| -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`  | `string`   | Title of page. When converted to HTML, it is specified in the `<title>` element.                                                                                                                                                               |
| `author` | `string[]` | Author of page. It is used for page index etc.                                                                                                                                                                                                 |
| `type`   | `string`   | Type of page. `toc` can be specified only in `index.md`, which means that it has (generates) multiple pages and their indexes. If specified otherwise, it is set to the `class` attribute of the `<body>` element. e.g. `<body class="type">`. |

### Generate multiple page and indexing

To add a page other than the cover page, do the following:

1.  Define `type: 'toc'` in page metadata
2.  Define links of other pages in `ul` and `li` elements

## License

[AGPL Version 3](LICENSE)
