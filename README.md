# ace-eno

eno language support for [Ace](https://ace.c9.io/)

![Screenshot](https://resources.eno-lang.org/plugins/ace.png)

## Usage

`builds/` contains the same content that [ace-builds](https://www.npmjs.com/package/ace-builds) provides, refer to their instructions but using the files from here instead if you want to use a custom ace build (currently with version 1.4.10 of ace) with eno support.

`mode/` contains the eno mode and highlight rule sources, copy these two files into ace's `mode/` directory if you want to build ace with eno support yourself.

## Further plans

This will eventually be submitted for official inclusion in ace when there is ample confidence regarding correctness and stability from production usage.
