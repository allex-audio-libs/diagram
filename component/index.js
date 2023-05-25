function createComponent (lib, blocklib, mylib) {
    'use strict';

    var Base = blocklib.Base;

    function Component () {
        Base.call(this);
    }
    lib.inherit(Component, Base);
    Component.prototype.destroy = function () {

    };

    mylib.Component = Component;
}
module.exports = createComponent;