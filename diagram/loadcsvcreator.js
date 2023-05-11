function createDiagramLoadCsv (lib, Diagram) {
    'use strict';

    var _LOADINGELEMENTS = 1;
    var _CREATINGLINKS = 2;

    function CsvLoader (diagram, options) {
        this.diagram = diagram;
        this.options = options||{};
        this.mode = _LOADINGELEMENTS;
        this.processLiner = this.processLine.bind(this);
        this.linesProcessed = 0;
    }
    CsvLoader.prototype.destroy = function () {
        this.linesProcessed = null;
        this.processLiner = null;
        this.mode = null;
        this.options = null;
        this.diagram = null;
    };
    function trimmer (str) {
        return str.trim();
    }
    CsvLoader.prototype.load = function (csv) {
        csv.split('\n').forEach(this.processLiner);
        this.destroy();
    };
    CsvLoader.prototype.processLine = function (line) {
        if (!line) {
            return;
        }
        line = line.trim();
        if (!line || line.startsWith('//')) {
            if (this.linesProcessed>0) {
                this.mode = _CREATINGLINKS;
            }
            return;
        }
        this[this.procFunc()](line.split(this.options.delimiter||'\t'));
        this.linesProcessed++;
    };
    CsvLoader.prototype.procFunc = function () {
        switch (this.mode) {
            case _LOADINGELEMENTS:
                return 'loadElement';
            case _CREATINGLINKS:
                return 'createLink';
            default: 
                return 'noOp';
        }
    };
    CsvLoader.prototype.loadElement = function (items) {
        if (items.length<2) {
            throw new lib.Error('INVALID_ELEMENT_LINE', items.join(this.options.delimiter||'\t')+' must have at least 2 elements');
        }
        //pretty ugly in terms of garbage creation... best resolution is to create a separate createBlockCSV method
        var mylength = items.length - (items.length%2);
        var options = {};
        for (var i=2; i<mylength; i+=2) {
            options[items[i]] = parseFloat(items[i+1]);
        }
        this.diagram.createBlock({
            name: items[0],
            type: items[1],
            options: options
        });
    };
    CsvLoader.prototype.createLink = function (items) {
        if (items.length<4) {
            throw new lib.Error('INVALID_LINK_LINE', items.join(this.options.delimiter||'\t')+' must have 4 elements');
        }
        this.diagram.createLink({
            out: {
                name: items[0],
                channel: items[1]
            },
            in: {
                name: items[2],
                channel: items[3]
            }
        });
    };
    CsvLoader.prototype.noOp = lib.dummyFunc;

    Diagram.prototype.loadcsv = function (csv, options) {
        var l = new CsvLoader(this, options);
        l.load(csv); //will auto-destruct eventually
    };
}
module.exports = createDiagramLoadCsv;