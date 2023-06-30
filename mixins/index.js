function createMixins (lib, mylib) {
    'use strict';

    var mixins = {};

    function BlocksAndLinksMixin () { }
    BlocksAndLinksMixin.prototype.destroy = function () {
        this.purge();
        if (this.blocks) {
            this.blocks.destroy();
        }
        this.blocks = null;
        this.links = null;
    };
    BlocksAndLinksMixin.prototype.purge = function () {
        if (this.blocks) {
            lib.containerDestroyAll(this.blocks);
            this.blocks.purge();
        }
        if (lib.isArray(this.links)) {
            lib.arryDestroyAll(this.links); //or maybe NOT, we'll see soon
        }
        this.links = [];
    };
    BlocksAndLinksMixin.addMethods = function (klass) {
        lib.inheritMethods(klass, BlocksAndLinksMixin
            , 'purge'
        );
    };
    mixins.BlocksAndLinks = BlocksAndLinksMixin;

    mylib.mixins = mixins;
}
module.exports = createMixins;