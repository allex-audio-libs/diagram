function destructBlock (block) {
    var as=block.attachments;
    block.destroy();
    expect(as.length).to.equal(0);
}

function diagramLoader (desc) {
    return Diagram.load(desc);
}

function unsuccessfulLoadingUnloadingIts (title, desc, exp) {
    it ('Load diagram '+title, function () {
        expect(diagramLoader.bind(null, desc)).to.throw(exp);
    });
    it ('Unload diagram '+title, function () {
        Diagram.purge();
    });
}

function itsForLoadSuccessfully (title, desc, wait) {
    it('Load '+title+' Diagram', function () {
        Diagram.load(desc);
        desc = null;
    });
    it('Wait for '+wait+' seconds', function () {
        this.timeout(1e7);
        var ret = lib.q.delay(wait*1000, true);
        wait = null;
        return ret;
    });
}

var sinesineamod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SineGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1
        }
    },{
        name: 'Converter',
        type: 'MinusOnePlusOneToZeroPlusOne'
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Converter',
            channel: 'Math'
        }
    },{
        out: {
            name: 'Converter',
            channel: 'Math'
        },
        in: {
            name: 'Sine',
            channel: 'Volume'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};
var sinesinefmod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SineGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1e-8
        }
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Sine',
            channel: 'FrequencyHzModulation'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};
var sinesquareamod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SquareGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1
        }
    },{
        name: 'Converter',
        type: 'MinusOnePlusOneToZeroPlusOne'
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Converter',
            channel: 'Math'
        }
    },{
        out: {
            name: 'Converter',
            channel: 'Math'
        },
        in: {
            name: 'Sine',
            channel: 'Volume'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};
var sinesquarefmod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SquareGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1e-8
        }
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Sine',
            channel: 'FrequencyHzModulation'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};
var sinesawamod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SawGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1
        }
    },{
        name: 'Converter',
        type: 'MinusOnePlusOneToZeroPlusOne'
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Converter',
            channel: 'Math'
        }
    },{
        out: {
            name: 'Converter',
            channel: 'Math'
        },
        in: {
            name: 'Sine',
            channel: 'Volume'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};
var sinesawfmod = {
    blocks: [{
        name: 'Clock',
        type: 'Clock',
        options: {
            SampleRate: 44100
        }
    },{
        name: 'Modulator',
        type: 'SawGenerator',
        options: {
            FrequencyHz: 1440,
            Volume: 1e-8
        }
    },{
        name: 'Sine',
        type: 'SineGenerator',
        options: {                    
        }
    },{
        name: 'Speaker',
        type: 'Speaker',
        options: {
            Channels: 1,
            SampleRate: 44100
        }
    }],
    links: [{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Modulator',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'Clock'
        },
        in: {
            name: 'Sine',
            channel: 'Clock'
        }
    },{
        out: {
            name: 'Modulator',
            channel: 'Samples'
        },
        in: {
            name: 'Sine',
            channel: 'FrequencyHzModulation'
        }
    },{
        out: {
            name: 'Clock',
            channel: 'SampleRate'
        },
        in: {
            name: 'Speaker',
            channel: 'SampleRate'
        }
    },{
        out: {
            name: 'Sine',
            channel: 'Samples'
        },
        in: {
            name: 'Speaker',
            channel: 'Channel1'
        }
    }]
};

describe('Test Diagram', function () {
    it('Load Lib', function () {
        return setGlobal('Lib', require('..')(execlib)); //Lib will export only the EventLite class
    });
    it('See Lib', function () {
        console.log('Lib', Lib);
    });
    it('Create Diagram', function () {
        return setGlobal('Diagram', new Lib.Diagram());
    });
    unsuccessfulLoadingUnloadingIts('none', null, /Diagram Descriptor was not defined/);
    /*
    unsuccessfulLoadingUnloadingIts('no blocks', {}, /Diagram Descriptor must have "blocks"/);
    unsuccessfulLoadingUnloadingIts('no links', {blocks:[]}, /Diagram Descriptor must have "links"/);
    */
    unsuccessfulLoadingUnloadingIts('no block', {blocks:[null]}, /A null block was detected/);
    unsuccessfulLoadingUnloadingIts('no name in block', {blocks:[{
    }]}, /A Diagram block must have a non empty name/);
    unsuccessfulLoadingUnloadingIts('no type in block', {blocks:[{
        name: 'bla'
    }]}, /A Diagram block must have a non empty type/);
    unsuccessfulLoadingUnloadingIts('no link', {
        blocks:[{
            name: 'blah',
            type: 'SineGenerator'
        }],
        links: [null]
    }, /A null link was detected in Descriptor/);
    unsuccessfulLoadingUnloadingIts('no out in link', {
        blocks:[{
            name: 'blah',
            type: 'Clock'
        }],
        links: [{
        }]
    }, /A Diagram link must have an "out" descriptor/);
    unsuccessfulLoadingUnloadingIts('no in in link', {
        blocks:[{
            name: 'blah',
            type: 'Clock'
        }],
        links: [{
            out: {}
        }]
    }, /A Diagram link must have an "in" descriptor/);
    unsuccessfulLoadingUnloadingIts('no name in in link', {
        blocks:[{
            name: 'blah',
            type: 'SineGenerator'
        }],
        links: [{
            out: {
            },
            in: {
            }
        }]
    }, /A Diagram link must have a non empty name/);
    unsuccessfulLoadingUnloadingIts('no channel in in link', {
        blocks:[{
            name: 'blah',
            type: 'Speaker'
        }],
        links: [{
            out: {
                name: 'blah'
            },
            in: {
            }
        }]
    }, /A Diagram link must have a non empty channel/);

    itsForLoadSuccessfully ('Sine AM By Sine', sinesineamod, 3);
    itsForLoadSuccessfully ('Sine FM By Sine', sinesinefmod, 3);
    itsForLoadSuccessfully ('Sine AM By Square', sinesquareamod, 3);
    itsForLoadSuccessfully ('Sine FM By Square', sinesquarefmod, 3);
    itsForLoadSuccessfully ('Sine AM By Saw', sinesawamod, 3);
    itsForLoadSuccessfully ('Sine FM By Saw', sinesawfmod, 3);
    it('Destroy Diagram', function () {
        Diagram.destroy();
    });
});