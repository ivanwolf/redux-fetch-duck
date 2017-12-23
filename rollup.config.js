import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  sourceMap: 'inline',
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [
    'redux',
  ]
};
