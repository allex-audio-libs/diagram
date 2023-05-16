function createDiagram (lib, blocklib, bufferlib, mylib) {
    'use strict';

    function Diagram () {
        this.blocks = new lib.Map();
        this.links = [];
    }
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

    Diagram.prototype.createBlock = function (blockdesc) {
        var b = new blocklib[blockdesc.type]();
        this.blocks.add(blockdesc.name, b);
        if (blockdesc.options) {
            lib.traverseShallow(blockdesc.options, optioner.bind(null, b));
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
            return; //maybe warn?
        }
        outb = this.blocks.get(linkdesc.out.name);
        if (!outb) {
            return; //maybe warn?
        }
        inb.attachToPreviousBlock(outb, linkdesc.out.channel, linkdesc.in.channel);
    };

    require('./loadcreator')(lib, Diagram, blocklib);
    require('./loadcsvcreator')(lib, bufferlib, Diagram);

    mylib.Diagram = Diagram;
}
module.exports = createDiagram;