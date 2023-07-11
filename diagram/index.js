function createDiagram (lib, blocklib, bufferlib, mylib) {
    'use strict';

    var BlocksAndLinksMixin = mylib.mixins.BlocksAndLinks;
    function Diagram () {
        BlocksAndLinksMixin.call(this);
        this.blocks = new lib.Map();
        this.links = [];        
    }
    BlocksAndLinksMixin.addMethods(Diagram);
    Diagram.prototype.destroy = function () {
        BlocksAndLinksMixin.prototype.destroy.call(this);
    }
    /*
    Diagram.prototype.destroy = function () {
        this.purge();
        if (this.blocks) {
            this.blocks.destroy();
        }
        this.blocks = null;
        this.links = null;
    };
    Diagram.prototype.purge = function () {
        if (this.blocks) {
            lib.containerDestroyAll(this.blocks);
            this.blocks.purge();
        }
        if (lib.isArray(this.links)) {
            lib.arryDestroyAll(this.links); //or maybe NOT, we'll see soon
        }
        this.links = [];
    };
    */

    function fileDescriptor (thingy) {
        var sp;
        if (!lib.isString(thingy)) {
            return null;
        }
        if (thingy.indexOf(':')<0) {
            return null;
        }
        return thingy.split(':').map(function (thingy) {return thingy.trim();});
    }
    function produceBlock (blockdesc) {
        var fd = fileDescriptor(blockdesc.type), ctor;
        if (fd) {
            switch (fd[0]) {
                case 'csvfile':
                    return {
                        instance: this.loadCsvFile(fd[1]),
                        optionsused: false
                    };
                default:
                    throw new lib.Error('UNSUPPORTED_FILE_DESCRIPTOR', blockdesc.type+' is not a supported file descriptor');
            }
        }
        ctor = blocklib[blockdesc.type];
        if (ctor.length==0) {
            return {
                instance: new ctor(),
                optionsused: false
            };
        }
        if (ctor.length==1) {
            return {
                instance: new ctor(blockdesc.options),
                optionsused: true
            };
        }
        throw new lib.Error('UNSUPPORTED_BLOCK_CONSTRUCTOR', blockdesc.type+' does not have a supported constructor because it receives '+ctor.length+' parameters.');
    }
    Diagram.prototype.createBlock = function (blockdesc) {
        var bp, b;
        bp = produceBlock.call(this, blockdesc);
        if (!(bp && bp.instance)) {
            console.error(blockdesc);
            throw new lib.Error('BLOCK_NOT_CREATED', 'Block could not be created');
        }
        b = bp.instance;
        this.blocks.add(blockdesc.name, b);
        if (!bp.optionsused) {
            if (blockdesc.options) {
                lib.traverseShallow(blockdesc.options, optioner.bind(null, b));
            }
        }
        b = null;
    };
    function optioner (block, optval, optname) {
        var methodname = 'set'+optname, method = block[methodname];
        if (lib.isFunction(method)) {
            method.call(block, optval);
            //b.setVolume(.5) <=> b.setVolume.call(b, .5) <=> b['setVolume'].call(b, .5);
            return;
        }
        //maybe warn?
        console.warn(methodname, 'is not a method of', block.constructor.name);
    }
    Diagram.prototype.createLink = function (linkdesc) {
        var inb, outb;
        inb = this.blocks.get(linkdesc.in.name);
        if (!inb) {
            console.error(linkdesc);
            throw new lib.Error('NO_LINK_INNAME', 'in.name was not specified in the linkdescriptor');
        }
        outb = this.blocks.get(linkdesc.out.name);
        if (!outb) {
            throw new lib.Error('NO_BLOCK_FOUND_FOR_LINKING', 'No block was found for '+linkdesc.out.name);
        }
        inb.attachToPreviousBlock(outb, linkdesc.out.channel, linkdesc.in.channel);
    };

    require('./loadcreator')(lib, Diagram, blocklib);

    mylib.Diagram = Diagram;
    require('./loadcsvcreator')(lib, bufferlib, blocklib, mylib);
    require('./loadfilecreator')(lib, bufferlib, blocklib, mylib);
}
module.exports = createDiagram;