//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import uglifyES from 'rollup-plugin-uglify-es'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  for (const productive of [false, true]) {
    configs.push(createStandardConfig(format, productive))
  }

  configs.push(createNoopConfig(format))
}

export default configs

// --- locals -------------------------------------------------------

function createStandardConfig(moduleFormat, productive) {
  return {
    input: 'src/main/js-spec.ts',

    output: {
      file: productive
        ? `dist/js-spec.${moduleFormat}.production.js`
        : `dist/js-spec.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: 'jsSpec', 
      sourcemap: productive ? false : 'inline',

      globals: {
        'js-spec': 'jsSpec',
      }
    },

    external: [],

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'"
        }
      }),
      typescript({
        exclude: 'node_modules/**',
        useTsconfigDeclarationDir: true
      }),
      productive && (moduleFormat === 'esm' ? uglifyES() : uglifyJS()),
      productive && gzip()
    ],
  }
}

function createNoopConfig(moduleFormat) {
  return {
    input: 'src/main/js-spec.noop.ts',

    output: {
      file: `dist/noop/js-spec.noop.${moduleFormat}.production.js`,

      format: moduleFormat,
      name: 'jsSpec', 
      sourcemap: false
    },

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',

        values: {
          'process.env.NODE_ENV': "'production'",
        }
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      moduleFormat === 'esm' ? uglifyES() : uglifyJS(),
      gzip()
    ],
  }
}
