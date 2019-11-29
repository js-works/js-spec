//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  for (const productive of [false, true]) {
    configs.push(createConfig(format, productive))
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(moduleFormat, productive) {
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
      }),
      productive && (moduleFormat === 'esm' ? terser() : uglifyJS()),
      productive && gzip()
    ],
  }
}
