function createPolyphoner (lib, blocklib, mylib) {
    'use strict';

    var polychannelcount = blocklib.MidiInput.channelCount;
    var Diagram = mylib.Diagram;

    function Polyphoner (options) {
        var i, envstr1;
        //blocks
        var mycsv = [
            'Midi	MidiInput	MidiChannel	'+options.MidiChannel,
        ];
        for (i=0; i<polychannelcount; i++) {
            mycsv.push(
                'ADSR'+(i+1)+'	ADSRBase	A	'+options.A+'	D	'+options.D+'	S	'+options.S+'	R	'+options.R,
                'Oscillator'+(i+1)+'	'+options.Type+'	FMFrequency	7	Frequency	122	Type	Square'
            );
        };
        for (i=1; i<polychannelcount; i++) {
            mycsv.push(
                'Adder'+(i+1)+'	Adder'
            );
        };
        mycsv.push(
            'Divider	Divider	Math2	'+polychannelcount
        );
        mycsv.push(' ');

        //links        
        for (i=0; i<polychannelcount; i++) {
            mycsv.push(
                'Midi	Trigger'+(i+1)+'	ADSR'+(i+1)+'	Trigger',
                'Midi	FrequencyHz'+(i+1)+'	Oscillator'+(i+1)+'	Frequency',
                'Midi	Velocity'+(i+1)+'	Oscillator'+(i+1)+'	FMDepth',
                'ADSR'+(i+1)+'	Volume	Oscillator'+(i+1)+'	Volume'
            );
        }
        mycsv.push(
            'Adder'+polychannelcount+'	Math	Divider	Math1',
            'Oscillator1	Samples	Adder2	Math1',
            'Oscillator2	Samples	Adder2	Math2'
        );
        for (i=2; i<polychannelcount; i++) {
            mycsv.push(
                'Adder'+i+'	Math	Adder'+(i+1)+'	Math1',
                'Oscillator'+(i+1)+'	Samples	Adder'+(i+1)+'	Math2'
            );
            }

        mycsv.push(' ');

        //environment
        envstr1 = 'in	number	d	Clock	Divider:Clock';
        for (i=0; i<polychannelcount; i++) {
            if (i>-1/*0*/) {
                envstr1+=',';
            }
            envstr1+='ADSR'+(i+1)+':Clock,Oscillator'+(i+1)+':Clock';
            if (i>0) {
                envstr1+=',Adder'+(i+1)+':Clock';
            }
        }
        mycsv.push(            
            envstr1,
            'out	number	a	Samples	Divider:Math'
        );
        var dg = new Diagram();
        var ret = dg.loadcsv(mycsv.join('\n'));
        dg.destroy();
        return ret;
    }

    blocklib.Polyphoner = Polyphoner;
}
module.exports = createPolyphoner;