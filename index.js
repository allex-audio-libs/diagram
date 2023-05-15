function creator(execlib, blocklib) {
    'use strict';

    var lib = execlib.lib;
    var mylib = {};

    require('./diagram')(lib, blocklib, mylib);
    //require('./component')(lib, blocklib, mylib);

    return mylib;
}

function createLib(execlib) {
    'use strict';
    return execlib.loadDependencies('client', ['allex:audio_block:lib'], creator.bind(null, execlib));
}
module.exports = createLib;