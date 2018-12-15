# Cirsim Circuit Simulator

**Cirsim 2 is under development as an independent system
for release to general users.**


Cirsim is a Circuit Simulator with drag and drop capabilities that is designed 
to support courses in introductory computer architecture. Cirsim can be used 
full-screen in a browser, in a window within a browser, and can be used to present 
live, operational circuits anywhere on a page, as shown in the example to the right.

Cirsim has a wide range of components from simple combinatory circuits to 
processor building blocks such as memory, program counters, and ALU's. 
Connections can represent both single-bit wires and multi-bit busses. 
It is possible to build and operator a small processor using Cirsim.

Cirsim has extensive facilities to support educational usage, including automatic 
testing of circuits and the ability to control component availability.

Cirsim has been used at Michigan State University since 2016 in CSE320 Computer
Organization and Architecture. 
## Install

### CDN

``` html
<script src="https://unpkg.com/cirsim/dist/cirsim.js"></script>
<!-- or -->
<script src="https://unpkg.com/cirsim/dist/cirsim.min.js"></script>
```

### Package managers

[npm](https://www.npmjs.com/package/cirsim): `npm install cirsim --save`

## Initialize

Please keep in mind that Cirsim is currently under development. I'm hoping
to have a release soon and there will be a full documentation web site, 
but if you just want to play with it, the most basic way to get Cirsim up 
and running would be this:

``` html
<!doctype html>
<html lang=en-US>
<head>
  <title>Cirsim Circuit Simulator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta charset="UTF-8">
  <script src="https://unpkg.com/cirsim/dist/cirsim.min.js"></script>
</head>
<body>
<div id="cirsim"></div>
<script>
    var cirsim = new Cirsim('#cirsim', {
        display: 'window',
        components: 'all'
    });
    cirsim.start();
</script>
</body>
</html>
```

Note that this will only worked if served from a server. Attempts to run 
 Cirsim from a local HTML file will throw cross-site scripting errors in 
 your browser. 
 
 A version of this
page is currently available [online](http://www.cse.msu.edu/~cbowen/cirsim/minimal.html).


## Options

Pending...

## License

Copyright 2016-2018 Michigan State University

Cirsim is released under the MIT license.

* * *

Written and maintained by Charles B. Owen

