import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
 
  plugins: [
    vue(),
    babel({
      babelConfig: {
        plugins: ['@babel/plugin-syntax-top-level-await'],
      },
    }),
    legacy(),
    
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },



  //manually added for style
  css: {
    preprocessorOptions: {
      scss: {
        // Additional SCSS configuration if required
        additionalData: `@import "@/styles/global.scss";` // Example of importing global styles
      },
    },
  },

  //
  build: {
    target: ['chrome89', 'edge89', 'firefox89', 'safari15',"chrome64", "edge79", "es2020", "firefox67", "safari12"], // Specify browsers
  
  },

});
