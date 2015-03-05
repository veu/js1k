# Evolution of Hype

An interactive simulation of hype

This demo was created for the [2015 JS1k competition](http://js1k.com/2015-hypetrain/) with the motto Hype Train.

## Compilation

Clone the repository and run the following commands

```
cd network
npm install
grunt
```

You'll find the compiled demo including the JS1k shim in `build/shim.html`.
The main source code can be found in [network/demo.js](network/demo.js).

To compile it properly you'll have to also disable *withMath* in *grunt-regpack*
(`lib/packer.js:13` the current version).

## Contributors

Rauri ([@raurir](https://twitter.com/raurir)) and Arne ([@veubeke](https://twitter.com/veubeke))
