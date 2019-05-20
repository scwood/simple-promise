This is a small [Promises/A+](https://promisesaplus.com) implementation that I wrote to try and understand promises a little better.

On top of what's defined in the spec, I also added some of the modern goodies like the constructor API, `.catch`, and the static `resolve`/`reject`/`all` methods.

To run the Promises/A+ test suite:

```
git clone https://github.com/scwood/simple-promise
cd simple-promise
npm install
npm test
```
