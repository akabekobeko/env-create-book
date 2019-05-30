import fs from 'fs'
import path from 'path'
import util from 'util'
import md2html from './md2html'
import mkdirp from 'mkdirp'

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
 * Create an HTML file path for storage.
 * If the original Markdown is located in a sub directory, create that hierarchy too.
 * @param src Path of source content directory.
 * @param dest Path of output directory.
 * @param file Path of Markdown file.
 * @returns Path of save HTML file.
 */
const checkSaveFilePath = (src: string, dest: string, file: string) => {
  const dir = path.join(dest, path.dirname(file).slice(src.length))
  mkdirp.sync(dir)

  const name = path.basename(file, '.md')
  return path.join(dir, `${name}.html`)
}

/**
 * Create HTML files from Markdown files in the specified directory.
 * @param src Path of source content directory.
 * @param dest Path of Markdown file.
 */
const build = async (src: string, dest: string) => {
  const files = await enumFiles(src)
  for (const file of files) {
    try {
      console.log(`INFO: src = "${file}"`)
      const html = await md2html(fs.readFileSync(file, 'utf8'))
      const savePath = checkSaveFilePath(src, dest, file)
      fs.writeFileSync(savePath, html)
      console.log(`INFO: dest = "${savePath}"`)
    } catch (err) {
      console.error(`ERROR: ${err}`)
    }
  }
}

export default build
