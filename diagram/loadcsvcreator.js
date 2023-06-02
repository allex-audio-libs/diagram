function createDiagramLoadCsv (lib, bufferlib, blocklib, mylib) {
    'use strict';

    var Diagram = mylib.Diagram;
    var _LOADINGELEMENTS = 1;
    var _CREATINGLINKS = 2;
    var _CREATINGENVIRONMENT = 3;
    var loadingStages = [_LOADINGELEMENTS, _CREATINGLINKS, _CREATINGENVIRONMENT];

    function Distribution (towhom, where) {
        this.towhom = towhom;
        this.where = where;
    }
    Distribution.prototype.destroy = function () {
        this.where = null;
        this.towhom = null;
    };
    Distribution.fromString = function (string) { //factory function
        if (!lib.isString(string)) {
            return null;
        }
        var split = string.split(':');
        if (split.length != 2) {
            return null;
        }
        return new Distribution(split[0].trim(), split[1].trim());
    };

    function Distributions () {
        bufferlib.DynaBuffer.call(this);
        this.possiblyAdder = this.possiblyAdd.bind(this);
    }
    lib.inherit(Distributions, bufferlib.DynaBuffer);
    function destroyer (item) {
        if (item && item.contents) {
            item.contents.destroy();
        }
    }
    Distributions.prototype.destroy = function () {
        this.possiblyAdder = null;
        this.traverse(destroyer);
        bufferlib.DynaBuffer.prototype.destroy.call(this);
    };
    Distributions.prototype.addFromString = function (string) {
        var ret, _ret, split;
        _ret = ret;
        if (string) {
            split = string.split(',');
            split.forEach(this.possiblyAdder);
            _ret = null;
        }
        return ret;
    };
    Distributions.prototype.possiblyAdd = function (stringy) {
        var dist = Distribution.fromString(stringy);
        if (dist) { //TODO: check for duplicates!
            this.push(dist);
        }
    };


    function CsvLoader (diagram, options) {
        this.diagram = diagram;
        this.result = null;
        this.neededInChannels = [];
        this.neededInDistributions = new lib.Map();
        this.neededOutChannels = [];
        this.neededOutDistributions = new lib.Map();
        this.options = options||{};
        this.loadingStage = 0;
        this.processLiner = this.processLine.bind(this);
        this.linesProcessed = 0;
    }
    CsvLoader.prototype.destroy = function () {
        this.linesProcessed = null;
        this.processLiner = null;
        this.options = null;
        this.neededOutChannels = null;
        if (this.neededInDistributions) {
            lib.containerDestroyAll(this.neededInDistributions);
            this.neededInDistributions.destroy();
        }
        this.neededInDistributions = null;
        this.result = null;
        this.diagram = null;
    };
    function trimmer (str) {
        return str.trim();
    }
    CsvLoader.prototype.load = function (csv) {
        var ret;
        csv.split('\n').forEach(this.processLiner);
        this.buildResult();
        ret = this.result;
        this.destroy();
        return ret;
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
        if (line.indexOf('//') == 0) {
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
    function optionValue (val) {
        var ret = parseFloat(val);
        if (isNaN(ret) && lib.isString(val) && val.length>0) {
            return val;
        }
        return ret;
    }
    CsvLoader.prototype.loadElement = function (items) {
        if (items.length<2) {
            throw new lib.Error('INVALID_ELEMENT_LINE', items.join(this.options.delimiter||'\t')+' must have at least 2 elements');
        }
        //pretty ugly in terms of garbage creation... best resolution is to create a separate createBlockCSV method
        var mylength = items.length - (items.length%2);
        var options = {};
        for (var i=2; i<mylength; i+=2) {
            options[items[i]] = optionValue(items[i+1]);
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
        if (!(lib.isArray(items) && items.length>3)){
            throw new lib.Error('INVALID_ENVIRONMENT_LINE', items.join(this.options.delimiter||'\t')+' must have 4 elements');
        }
        switch (items[0]) {
            case 'in':
                this.createInEnvironment(items[1], items[2], items[3]);
                break;
            case 'out':
                this.createOutEnvironment(items[1], items[2], items[3]);
                break;
            default: 
                throw new lib.Error('INVALID_ENVIRONMENT_LINE', items.join(this.options.delimiter||'\t')+' must have its first element equal to "in" or "out"');
        }
    };
    var zeroString = String.fromCharCode(0);
    CsvLoader.prototype.createInEnvironment = function (channeltype, channelname, distribution) {
        var dists;
        var cht = channelname+zeroString+channeltype; //{name: channelname, type: channeltype}
        if (this.neededInChannels.indexOf(cht) < 0) {
            this.neededInChannels.push(cht);
        }
        dists = this.neededInDistributions.get(cht);
        if (!dists) {
            dists = new Distributions();
            this.neededInDistributions.add(cht, dists);
        }
        dists.addFromString(distribution);
    };
    CsvLoader.prototype.createOutEnvironment = function (channeltype, channelname, internalsource) {
        var cht = channelname+zeroString+channeltype; //{name: channelname, type: channeltype}
        if (this.neededOutChannels.indexOf(cht) < 0) {
            this.neededOutChannels.push(cht);
        }
        if (this.neededOutDistributions.get(cht)) {
            throw new lib.Error('DUPLICATE_OUT_ENVIRONMENT', internalsource+' asks for an Out Environment that has already been defined.');
        }
        this.neededOutDistributions.add(cht, new Distribution.fromString(internalsource));
    };
    function listenerchannelmixiner (res, cht) {
        var nameandtype = cht.split(zeroString);
        blocklib.mixins.requestChannelMixin(nameandtype[0], nameandtype[1], false);
        res.push('blocklib.mixins.'+nameandtype[0]+'Listener');
        return res;
    }
    function emitterchannelmixiner (res, cht) {
        var nameandtype = cht.split(zeroString);
        blocklib.mixins.requestChannelMixin(nameandtype[0], nameandtype[1], true);
        res.push({
            name: 'blocklib.mixins.'+nameandtype[0]+'Emitter',
            params: [0]
        });
        return res;
    }
    function inputProducerForDiagram (name, cht) {
        var nameandtype = cht.split(zeroString);
        var block = this.blocks.get(name);
        if (!block) {
            return lib.dummyFunc(); //can also console.warn
        }
        return block['on'+nameandtype[0]+'Input'].bind(block);
    }
    function inputMethodNameOf (channelname) {
        return 'on'+channelname+'Input';
    }
    function setMethodNameOf (channelname) {
        return 'set'+channelname;
    }
    function indisttraverserbytarget (fieldsandmethods, channelname, bucket) {
        var dist, methodname, name;
        if (!(bucket && bucket.contents)) {
            return;
        }
        dist = bucket.contents;
        methodname = inputMethodNameOf(channelname);
        name = dist.towhom+dist.where+'Inputer';
        fieldsandmethods.fields.push({
            name: name,
            initial: "inputProducerForDiagram.call(this, '"+dist.towhom+"', '"+dist.where+"')",
            destruction: 'nullit'
        });
        fieldsandmethods.methods[methodname].lines.push('this.'+name+'(number)');
    }
    function indisttraverser (fieldsandmethods, value, cht) {
        var methodname;
        var nameandtype = cht.split(zeroString);
        var channelname = nameandtype[0];
        if (!(value && lib.isFunction(value.traverse))) {
            return;
        }

        /*
            now fieldsandmethods.outdistributions have to be checked
            if they don't have channelname,
            we have to produce set+channelname method
        */
        if (!fieldsandmethods.outdistributions.get(channelname)) {
            methodname = setMethodNameOf(channelname);
            if (!fieldsandmethods.methods[methodname]) {
                fieldsandmethods.methods[methodname] = {
                    params: ['number'],
                    lines: [
                        'this.'+inputMethodNameOf(channelname)+'(number)'
                    ]
                };
            }
        }

        methodname = inputMethodNameOf(channelname);
        /*
        var lines = [];
        if (channelname.indexOf('Frequency')>=0) {
            lines.push('debugger');
        }
        */
        if (!fieldsandmethods.methods[methodname]) {
            fieldsandmethods.methods[methodname] = {
                params: ['number'],
                lines: []
            };
        }
        value.traverse(indisttraverserbytarget.bind(null, fieldsandmethods, channelname));
        fieldsandmethods = null;
        channelname = null;
    }
    function outdisttraverser (ctorlines, value, cht) {
        var nameandtype = cht.split(zeroString);
        var channelname = nameandtype[0];
        ctorlines.push("this.attachToBlockOutput('"+channelname+"', '"+value.towhom+"', '"+value.where+"')");
    }
    CsvLoader.prototype.buildResult = function () {
        //here
        //1. A Component class should be created that inherits from Diagram
        //2. All the channels should be added (in ctor, addMethods, in dtor)
        //3. An instance of this class should be created
        //4. blocks and links from this should be transferred to the newly created instance
        //5. The newly created instance should connect its in/out to the inner blocks
        //6. THIS is the result of load
        var mixins, classstr, klass, instance, initfields;
        var methods;
        var infields, _infields;
        var ctorlines, _ctorlines;
        mixins = this.neededInChannels.reduce(listenerchannelmixiner, []);
        this.neededOutChannels.reduce(emitterchannelmixiner, mixins);
        this.neededOutChannels.reduce(listenerchannelmixiner, mixins);

        initfields = [
            {
                name: 'blocks',
                initial: "blocks",
                destruction: 'ignoreit'
            },
            {
                name: 'links',
                initial: "links",
                destruction: 'ignoreit'
            }
        ];

        methods = {};
        /*
        methods: {
            onClockInput: {
                params: ['number'],
                lines: [
                'this.NoiseClockInputer(number);',
                'this.AModulator1ClockInputer(number);',
                'this.SineClockInputer(number);',
                ...
                ]
            }
        }
        */

        infields = [];
        _infields = infields;
        this.neededInDistributions.traverse(indisttraverser.bind(null, {
            outdistributions: this.neededOutDistributions,
            methods: methods,
            fields: _infields
        }));
        _infields = null;

        ctorlines = [];
        _ctorlines = ctorlines;
        this.neededOutDistributions.traverse(outdisttraverser.bind(null, _ctorlines));
        _ctorlines = null;

        classstr = blocklib.mixins.createClass({
            name: 'Component',
            base: 'mylib.Component',
            ctor:{
                params: ['blocks', 'links'],
                lines: ctorlines,
                debug: false
            },
            mixins: mixins,
            //fields: fields
            fields: initfields.concat(infields),
            methods: methods
        });
        eval ('klass = '+classstr);
        klass.prototype.attachToBlockOutput = function (mychannel, blockname, blockchannel) {
            var outb;
            outb = this.blocks.get(blockname);
            if (!outb) {
                return; //maybe warn?
            }
            this.attachToPreviousBlock(outb, blockchannel, mychannel);
        };
        instance = new klass(this.diagram.blocks, this.diagram.links);
        this.diagram.blocks = null;
        this.diagram.links = null;
        //transfer of created blocks to newly created Diagram is over, my destroy will do nothing special
        this.result = instance;
    };
    CsvLoader.prototype.noOp = lib.dummyFunc;

    Diagram.prototype.loadcsv = function (csv, options) {
        var l = new CsvLoader(this, options);
        return l.load(csv); //will auto-destruct eventually
    };
}
module.exports = createDiagramLoadCsv;