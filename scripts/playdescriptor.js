var execlib;
var diagramlib;
var filename;
var duration;

var fs = require('fs')


function go (_diagramlib) {
    var inb, inj, diagram;
    diagramlib = _diagramlib;
    inb = fs.readFileSync(filename);
    if (!inb) {
        console.error('The Diagram JSON file name', filename, 'must exist and not be empty');
        return;
    }
    try {
        inj = JSON.parse(inb.toString());
        diagram = new diagramlib.Diagram();
        diagram.load(inj);
        execlib.lib.runNext(process.exit.bind(process, 0), duration);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}


function main (_execlib) {
    var argcount = process.argv.length;
    if (argcount<4) {
        console.error('You have to specify the Diagram JSON file name');
        return;
    }
    filename = process.argv[3];
    duration = (parseFloat(process.argv[4]) || 10) * 1000;
    execlib = _execlib;
    execlib.loadDependencies('client', ['allex:audio_diagram:lib'], go);
}

module.exports = main;