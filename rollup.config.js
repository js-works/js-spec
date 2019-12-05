//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['core', 'validators']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createConfig(pkg, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  let file

  if (pkg === 'core') {
    file = productive
      ? `dist/js-spec.${moduleFormat}.production.js`
      : `dist/js-spec.${moduleFormat}.development.js`
  } else if (pkg === 'validators')  {
    file = productive
      ? `dist/js-spec.validators.${moduleFormat}.production.js`
      : `dist/js-spec.validators.${moduleFormat}.development.js`
  }

  return {
    input:
      pkg === 'core'
        ? 'src/main/js-spec.ts'
        : 'src/main/api/validators.ts',

    output: {
      file,
      format: moduleFormat,
      name: pkg === 'core' ? 'jsSpec' : 'jsSpec.validators', 
      sourcemap: false,

      globals: {
        'js-spec': 'jsSpec',
      }
    },

    external: [],

    plugins: [
      resolve(),
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
