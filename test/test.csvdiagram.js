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
        var loadeddiagram = Diagram.loadcsv(desc);
        Diagram.destroy();
        Diagram = loadeddiagram;
        desc = null;
    });
    it('Wait for '+wait+' seconds', function () {
        this.timeout(1e7);
        var ret = lib.q.delay(wait*1000, true);
        wait = null;
        return ret;
    });
}

var mycsv = [
"Clock	Clock	SampleRate	44100",
"FModulator1	SineGenerator	FrequencyHz	14",
"FModulator2	SineGenerator	FrequencyHz	14",
"Sine1	SineGenerator	FrequencyHz	1000",
"Sine2	SineGenerator	FrequencyHz	500",
"AModulator1	TriangleGenerator	FrequencyHz	0.8	PulseWidth	0.5",
"AModulator2	TriangleGenerator	FrequencyHz	0.8	PulseWidth	0.5",
"Converter1	MinusOnePlusOneToZeroPlusOne",
"Converter2	MinusOnePlusOneToZeroPlusOne",
"Negative	Negative",
"Attn1	Multiplier	Math2	1e-8",
"Attn2	Multiplier	Math2	1e-8",
"OutAttn	Divider	Math2	2",
"Adder	Adder",
"Speaker	Speaker	Channels	1",
"",
"Clock	Clock	FModulator1	Clock",
"Clock	Clock	FModulator2	Clock",
"Clock	Clock	Sine1	Clock",
"Clock	Clock	Sine2	Clock",
"Clock	Clock	AModulator1	Clock",
"Clock	Clock	AModulator2	Clock",
"Clock	Clock	Converter1	Clock",
"Clock	Clock	Converter2	Clock",
"Clock	Clock	Negative	Clock",
"Clock	Clock	Attn1	Clock",
"Clock	Clock	Attn2	Clock",
"Clock	Clock	OutAttn	Clock",
"Clock	Clock	Adder	Clock",
"Clock	Clock	Speaker	Clock",
"Clock	SampleRate	Speaker	SampleRate",
"FModulator1	Samples	Sine1	FrequencyHzModulation",
"FModulator2	Samples	Sine2	FrequencyHzModulation",
"AModulator1	Samples	Negative	Math",
"Negative	Math	Converter1	Math",
"AModulator2	Samples	Converter2	Math",
"Converter1	Math	Attn1	Math1",
"Converter2	Math	Attn2	Math1",
"Attn1	Math	FModulator1	Volume",
"Attn2	Math	FModulator2	Volume",
"Sine1	Samples	Adder	Math1",
"Sine2	Samples	Adder	Math2",
"Adder	Math	OutAttn	Math1",
"OutAttn	Math	Speaker	Channel1",
].join('\r\n');

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


    itsForLoadSuccessfully ('Sine AM By Sine', mycsv, 3);
    /*
    itsForLoadSuccessfully ('Sine AM By Sine', sinesineamod, 3);
    itsForLoadSuccessfully ('Sine FM By Sine', sinesinefmod, 3);
    itsForLoadSuccessfully ('Sine AM By Square', sinesquareamod, 3);
    itsForLoadSuccessfully ('Sine FM By Square', sinesquarefmod, 3);
    itsForLoadSuccessfully ('Sine AM By Saw', sinesawamod, 3);
    itsForLoadSuccessfully ('Sine FM By Saw', sinesawfmod, 3);
    */
    it('Destroy Diagram', function () {
        Diagram.destroy();
    });
});