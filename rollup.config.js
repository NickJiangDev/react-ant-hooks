
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import {uglify} from 'rollup-plugin-uglify'


import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      exports: 'named',
      name: 'antchooks'
    },
    // {
    //   file: pkg.module,
    //   format: 'es',
    //   exports: 'named',
    //   sourcemap: true,
    // },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    external(),
    url(),
    resolve(),
    typescript({
      clean: true,
      rollupCommonJSResolveHack: true,
      exclude: ['*.d.ts', '**/*.d.ts'],
    }),
    commonjs(),
    uglify()
  ],
};
