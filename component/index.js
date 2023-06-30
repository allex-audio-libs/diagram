function createComponent (lib, blocklib, mylib) {
    'use strict';

    var Base = blocklib.Base;
    var BlocksAndLinksMixin = mylib.mixins.BlocksAndLinks;

    function Component () {
        Base.call(this);
        BlocksAndLinksMixin.call(this);
    }
    lib.inherit(Component, Base);
    BlocksAndLinksMixin.addMethods(Component);
    Component.prototype.destroy = function () {
        BlocksAndLinksMixin.prototype.destroy.call(this);
    };

    mylib.Component = Component;
}
module.exports = createComponent;