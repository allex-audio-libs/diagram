function creator(execlib, blocklib, bufferlib) {
    'use strict';

    var lib = execlib.lib;
    var mylib = {};

    require('./diagram')(lib, blocklib, bufferlib, mylib);
    require('./component')(lib, blocklib, mylib);

    return mylib;
}

function createLib(execlib) {
    'use strict';
    return execlib.loadDependencies('client', ['allex:audio_block:lib', 'allex:audio_buffer:lib'], creator.bind(null, execlib));
}
module.exports = createLib;