function createDiagramLoad (lib, Diagram, blocklib) {
    'use strict';

    function isValidBlock (block) {
        if (!block) {
            throw new lib.Error('NO_DIAGRAM_BLOCK', 'A null block was detected in Descriptor');
        }
        if (!lib.isNonEmptyString(block.name)) {
            throw new lib.Error('NO_DIAGRAM_BLOCK_NAME', 'A Diagram block must have a non empty name (String)');
        }
        if (!lib.isNonEmptyString(block.type)) {
            throw new lib.Error('NO_DIAGRAM_BLOCK_TYPE', 'A Diagram block must have a non empty type (String)');
        }
        if (!lib.isFunction(blocklib[block.type])) {
            throw new lib.Error('UNSUPPORTED_BLOCK_TYPE', 'A Diagram block defined a type '+block.type+' that is not supported yet');
        }
        return;
    }
    function isValidInOutLinkObj (name, obj) {
        if (!obj) {
            throw new lib.Error('NOT_AN_OBJECT', 'Nothing was provided for '+name+' in link');
        }
        if (!lib.isNonEmptyString(obj.name)) {
            throw new lib.Error('NO_DIAGRAM_LINK_NAME', 'A Diagram link must have a non empty name (String) for its '+name+' object');
        }
        if (!lib.isNonEmptyString(obj.channel)) {
            throw new lib.Error('NO_DIAGRAM_LINK_CHANNEL', 'A Diagram link must have a non empty channel (String) for its '+name+' object');
        }
    }
    function isValidLink (link) {
        if (!link) {
            throw new lib.Error('NO_DIAGRAM_LINK', 'A null link was detected in Descriptor');
        }
        if (!link.out) {
            throw new lib.Error('NO_DIAGRAM_LINK_OUT', 'A Diagram link must have an "out" descriptor');
        }
        if (!link.in) {
            throw new lib.Error('NO_DIAGRAM_LINK_IN', 'A Diagram link must have an "in" descriptor');
        }
        isValidInOutLinkObj('out', link.out);
        isValidInOutLinkObj('in', link.in);
        return;
    }

    function validateDesc (desc) {
        if (!desc) {
            throw new lib.Error('NO_DIAGRAM_DESCRIPTOR', 'Diagram Descriptor was not defined.');
        }
        /*
        if (!lib.isArray(desc.blocks)) {
            throw new lib.Error('NO_DIAGRAM_DESCRIPTOR_BLOCKS', 'Diagram Descriptor must have "blocks" as an Array[Block].');
        }
        if (!lib.isArray(desc.links)) {
            throw new lib.Error('NO_DIAGRAM_DESCRIPTOR_LINKS', 'Diagram Descriptor must have "links" as an Array[Block].');
        }
        */
        lib.isArrayOfHaving(desc.blocks, isValidBlock);
        lib.isArrayOfHaving(desc.links, isValidLink);
    }

    Diagram.prototype.load = function (desc) {
        if (!this.blocks) {
            return; //I'm dead already
        }
        validateDesc(desc); //optionally throws
        this.purge();
        desc.blocks.forEach(this.createBlock.bind(this));
        desc.links.forEach(this.createLink.bind(this));
    };
}
module.exports = createDiagramLoad;