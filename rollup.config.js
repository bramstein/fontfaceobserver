import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";

const copyright = "© Bram Stein - Damien Seguin. License: BSD-3-Clause";
const banner = `/* Font Face Observer v${pkg.version} - ${copyright} */`;

const babelCommonOptions = {
  exclude: ["node_modules/**"],
  plugins: [
    "external-helpers",
    "transform-class-properties",
    "transform-object-rest-spread"
  ]
};

const isDev = process.env.NODE_ENV === "development";

export default [
  {
    input: "src/index.js",
    plugins: [
      resolve(),
      babel({
        ...babelCommonOptions,
        presets: [
          [
            "env",
            {
              targets: {
                browsers: ["ie >= 8"]
              },
              modules: false
            }
          ]
        ]
      }),
      commonjs(),
      isDev ? 0 : uglify()
    ].filter(Boolean),
    output: {
      banner,
      name: "FontFaceObserver",
      file: pkg.browser,
      format: "umd"
    }
  },
  {
    input: "src/index.js",
    plugins: [
      babel({
        ...babelCommonOptions,
        presets: [
          [
            "env",
            {
              targets: {
                browsers: ["last 2 versions"]
              },
              modules: "commonjs"
            }
          ]
        ]
      }),
      isDev ? 0 : uglify()
    ].filter(Boolean),
    output: {
      banner,
      file: pkg.main,
      format: "cjs"
    }
  },
  {
    input: "src/index.js",
    plugins: [
      babel({
        ...babelCommonOptions,
        presets: [
          [
            "env",
            {
              targets: {
                browsers: ["last 2 versions"]
              },
              modules: false
            }
          ]
        ]
      })
    ],
    output: {
      banner,
      format: "es",
      file: pkg.module
    }
  }
];
