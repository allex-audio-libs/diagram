function createDiagramLoadCsv (lib, Diagram) {
    'use strict';

    var _LOADINGELEMENTS = 1;
    var _CREATINGLINKS = 2;
    var _CREATINGENVIRONMENT = 3;
    var loadingStages = [_LOADINGELEMENTS, _CREATINGLINKS, _CREATINGENVIRONMENT];

    function CsvLoader (diagram, options) {
        this.diagram = diagram;
        this.options = options||{};
        this.loadingStage = 0;
        this.processLiner = this.processLine.bind(this);
        this.linesProcessed = 0;
    }
    CsvLoader.prototype.destroy = function () {
        this.linesProcessed = null;
        this.processLiner = null;
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
        if (!line) {
            if (this.linesProcessed>0) {
                if (this.loadingStage < loadingStages.length-1) {
                    this.loadingStage++;
                }
            }
            return;
        }
        this[this.procFunc()](line.split(this.options.delimiter||'\t'));
        this.linesProcessed++;
    };
    CsvLoader.prototype.procFunc = function () {
        var currentmode = loadingStages[this.loadingStage];
        switch (currentmode) {
            case _LOADINGELEMENTS:
                return 'loadElement';
            case _CREATINGLINKS:
                return 'createLink';
            case _CREATINGENVIRONMENT:
                return 'createEnvironment';
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
    CsvLoader.prototype.createEnvironment = function (items) {
        if (!(lib.isArray(items) && items.length>2)){
            throw new lib.Error('INVALID_ENVIRONMENT_LINE', items.join(this.options.delimiter||'\t')+' must have 3 elements');
        }
        switch (items[0]) {
            case 'in':
                this.diagram.createInEnvironment(items[1], items[2]);
                break;
            case 'out':
                this.diagram.createOutEnvironment(items[1], items[2]);
                break;
            default: 
                throw new lib.Error('INVALID_ENVIRONMENT_LINE', items.join(this.options.delimiter||'\t')+' must have its first element equal to "in" or "out"');
        }
    };
    CsvLoader.prototype.createInEnvironment
    CsvLoader.prototype.noOp = lib.dummyFunc;

    Diagram.prototype.loadcsv = function (csv, options) {
        var l = new CsvLoader(this, options);
        l.load(csv); //will auto-destruct eventually
    };
}
module.exports = createDiagramLoadCsv;