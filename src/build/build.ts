import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import chokidar from 'chokidar'
import md2html from './md2html'

const readdir = util.promisify(fs.readdir)

/**
 * Recursively enumurate Markdown files from the directory.
 * @param dir Path of target directory.
 * @param files Enumerated file path collection.
 * @returns A list of newly added collections added to `files`.
 */
const enumFiles = async (dir: string, files: string[] = []) => {
  let results = files.concat()
  const items = await readdir(dir, { withFileTypes: true })

  for (const item of items) {
    if (item.isDirectory()) {
      const subItems = await enumFiles(path.join(dir, item.name))
      results = results.concat(subItems)
    } else if (item.isFile && path.extname(item.name) === '.md') {
      results.push(path.join(dir, item.name))
    }
  }

  return results
}

/**
 * Check path of directories and file.
 * @param src Path of source content directory.
 * @param dest Path of output HTMLfile directory.
 * @param file Path of Markdown file.
 * @returns Information of path.
 */
const checkPath = (src: string, dest: string, file: string) => {
  const dir = path.join(dest, path.dirname(file).slice(src.length))
  const name = path.basename(file, '.md')

  return {
    dir,
    file: path.join(dir, `${name}.html`),
    relative: path.relative(dir, dest)
  }
}

/**
 * Create HTML files from Markdown files in the specified directory.
 * @param src Path of source content directory.
 * @param dest Path of output HTMLfile directory.
 */
const buildHTML = async (src: string, dest: string, file: string) => {
  try {
    const info = checkPath(src, dest, file)
    const html = await md2html(fs.readFileSync(file, 'utf8'), info.relative)
    mkdirp.sync(info.dir)
    fs.writeFileSync(info.file, html)
    console.log(`INFO: "${file}" -> "${info.file}"`)
  } catch (err) {
    console.error(`ERROR: ${err}`)
  }
}

/**
 * Convert all Markdown files to HTML.
 * @param src Path of source content directory.
 * @param dest Path of output HTMLfile directory.
 */
const buildAll = async (src: string, dest: string) => {
  const files = await enumFiles(src)
  for (const file of files) {
    await buildHTML(src, dest, file)
  }
}

/**
 * Convert the added or changed Markdown file to HTML.
 * @param src Path of source content directory.
 * @param dest Path of output HTMLfile directory.
 */
const buildWatch = async (src: string, dest: string) => {
  const watcher = chokidar.watch(path.join(src, '**', '*.md'))
  watcher.on('ready', () => {
    watcher.on('add', (file) => buildHTML(src, dest, file))
    watcher.on('change', (file) => buildHTML(src, dest, file))
  })
}

/**
 * Create HTML files from Markdown files in the specified directory.
 * @param src Path of source content directory.
 * @param dest Path of output HTMLfile directory.
 * @param watch Execute file change monitoring mode.
 */
const build = async (src: string, dest: string, watch: boolean) => {
  if (watch) {
    await buildAll(src, dest)
    buildWatch(src, dest)
  } else {
    buildAll(src, dest)
  }
}

export default build
