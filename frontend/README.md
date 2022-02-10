# Capstone Frontend

## Specs

- Written in HTML and Typescript.
- Packages handled by npm.
- Typescript compiled and packaged by webpack.

## Getting Started

1. Run `npm install` to get the required libraries.
2. Write code in the `src\index.html` or `src\main.ts` files.
3. Run `npm start` to build and start a local webserver on port 8080.
4. When you are happy with the end result, run the `deploy.py` script to upload to the online webserver.
5. Check it out at `https://capstone.simonliveshere.com`.

## Requirements

- npm (can be obtained by installing Node.js).

## About

- Static page (no server-side scripting) written in HTML and Typescript.
- Packages are handled by npm to ensure consistent versioning and (reasonably) painless updates.
- Compilation and packaging handled by webpack.

## Getting Started

1. Run `npm install` to get the required libraries.
2. Write code in the `src\index.html` or `src\main.ts` files.
3. Run `npm start` to build and start a local webserver on port 8080.
   - If using VSCode (which I recommend), get the "Debugger for Chrome" extension.
   - You can then use the debug inside VSCode to connect to the webserver and debug within VSCode.
   - Otherwise, use your preferred browser and connect to the webpage to debug.
   - The webserver will automatically reload the page on saved changes to the source files.
4. When you are happy with the end result, run the `deploy.py` script to upload to the online webserver.
5. Check it out at `http://vm0.simonliveshere.com`.

## Typescript

- Typescript is used for the strict typing and static code analysis.
- The Typescript code (`.ts` files in `src\js`) has compilation controlled by `tsconfig.json`.
- To import from a library, use `import {* or specific class/function name} as {choose a name} from "{package or file name}"`.
- If you don't need to make references to a library in your code but still require the library to be there (e.g. for Bootstrap), use `import "bootstrap"`.

- Start the webserver with `npm start`.
  - Changes to the code will trigger a recompilation and browser reload.
  - Sometimes the reload gets started too early before the compilation process is completely finished - reload the browser manually if this happens.
- Alternatively, if you want to use your own webserver, use `npm run build` instead to compile.

- After compilation, `.js` and `.js.map` files will be created.
  - The `.js` file is the transpiled javascript that gets run by the browser and should include all the imported packages automatically.
  - The `.js.map` file is used for debugging.

## Packages

- When adding packages, make sure to also add the typing package along with it (https://microsoft.github.io/TypeSearch/).
  - E.g. For jQuery: `npm install --save jquery @types/jquery`.
- If there are additional dependencies that need to be in a specific folder, use the `copy-webpack-plugin` plugin to copy from the npm source into the output folder.
  - E.g. To copy the Bootstrap CSS files from the Bootstrap npm package into `src/css`, a CopyPlugin pattern is configured in `webpack.config.js`. Check the code there and use it as a template.

## Deployment

- Run deploy.py.
