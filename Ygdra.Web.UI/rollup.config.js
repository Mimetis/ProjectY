// import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import { terser } from "rollup-plugin-terser";
// import uglify from "rollup-plugin-uglify";

export default [
    {
        input: './ClientSrc/index.js',
        output: {
            file: 'wwwroot/js/index.es.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonjs(),
            //terser()
            // uglify()
        ]

    },

    // SystemJS version, for older browsers
    {
        input: 'ClientSrc/index.js',
        output: {
            file: 'wwwroot/js/index.legacy.js',
            format: 'system',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonjs()
        ]
    }


    // {
    //     input: 'client/index.ts',
    //     output: {
    //         dir: 'public/javascripts/module',
    //         format: 'es'
    //     },
    //     plugins: [
    //         typescript(/*{ plugin options }*/)
    //     ],
    //     experimentalCodeSplitting: true,
    //     experimentalDynamicImport: true
    // },
    // {
    //     input: 'client/index.ts',
    //     output: {
    //         dir: 'public/javascripts/nomodule',
    //         format: 'system',
    //     },
    //     plugins: [
    //         typescript(/*{ plugin options }*/)
    //     ],
    //     experimentalCodeSplitting: true,
    //     experimentalDynamicImport: true
    // }
]