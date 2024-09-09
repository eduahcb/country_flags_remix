import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    svgr(),
    tsconfigPaths(),
    vanillaExtractPlugin(),
  ],
  server: {
    port: 3000,
  }
});
