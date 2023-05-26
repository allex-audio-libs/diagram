var fs = require('fs');

function createDiagramLoadFile (lib, bufferlib, blocklib, mylib) {
    'use strict';

    var Diagram = mylib.Diagram;

    Diagram.prototype.loadCsvFile = function (filename) {
        var component;
        try {
            var d = new Diagram();
            component = d.loadcsv(fs.readFileSync(filename).toString());
            d.destroy();
            return component;
        } catch (e) {
            var a = process.cwd();
            console.error(e);
        }
    };

}
module.exports = createDiagramLoadFile;