This is small [Promises/A+](https://promisesaplus.com) implementation that I wrote for fun and to try and understand the promises spec a little better. All tests pass!

I also added some of the modern goodies not defined in the spec like the constructor API, `.catch`, and the static `resolve`/`reject`/`all` methods.

See it in action:

```
git clone https://github.com/scwood/simple-promise
cd simple-promise
npm install
npm test
```
