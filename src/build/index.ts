import build from './build'

/**
 * Parse command line arguments.
 * @param argv Arguments of command line.
 * @returns Option settings generated from parsed results.
 */
const parseArgv = (argv: string[]) => {
  const options = { src: 'src/content', dest: 'dest' }
  for (let i = 0; i < argv.length; ++i) {
    const value = argv[i]
    switch (value) {
      case '-i':
      case '--input':
        if (i < argv.length - 1) {
          options.src = argv[++i]
        }
        break

      case '-o':
      case '--output':
        if (i < argv.length - 1) {
          options.dest = argv[++i]
        }
        break
    }
  }

  return options
}

const options = parseArgv(process.argv.slice(2))
build(options.src, options.dest)
