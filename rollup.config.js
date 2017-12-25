import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    resolve(),
    eslint(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [
    'redux',
  ]
};
