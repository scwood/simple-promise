This is a [Promises/A+](https://promisesaplus.com) implementation that I wrote for fun.

On top of what's defined in the spec, I also added some of the modern goodies like the constructor API, `.catch`, and the static `.resolve`/`.reject`/`.all` methods.

To run the Promises/A+ test suite (and a few of my own):

```
git clone https://github.com/scwood/simple-promise
cd simple-promise
npm install
npm test
```
