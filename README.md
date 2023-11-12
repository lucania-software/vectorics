# Vectorics
A linear algebra library built to run in Node and browser environments.

## Getting Started

### Using in Node Environments
Install the library using NPM.
```bash
npm install @lucania/vectorics
```
#### CommonJS Modules
Import the library as a CommonJS package.
```ts
const Vectorics = require("@lucania/vectorics");

const vector = new Vectorics.Vector2(1, 1);
vector.distance(new Vector2(3, 4))
```

#### ES6 Modules
Import the library as an ES6 module.
```ts
import { Vector2 } from "@lucania/vectorics";

const vector = new Vector2(6, 8);
vector.normalize()
```

### Using in Browser Environments (Client-side)
Download the library into your project.
```bash
git clone https://github.com/lucania-software/vectorics libraries/vectorics
```
Link the library script in your page's HTML.
```HTML
<head>
    ...
    <script src="./libraries/vectorics/build/index.js"></script>
    ...
</head>
```
Start using the library!
```ts
const matrix = new Vectorics.Matrix3(
    1, 9, 3,
    0, 5, 6,
    3, 2, 8
);
matrix.transpose();
matrix.multiply(3);
```