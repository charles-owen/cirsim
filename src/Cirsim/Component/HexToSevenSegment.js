import {Component} from '../Component';
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: Hexadecimal to 7-segment decoder

 * @constructor
 */
export const HexToSevenSegment = function() {
    Component.call(this);

    this.height = 134;
    this.width = 64;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    // Four inputs
    var y = -16 * 3 - 8;
    var len = 16;

    this.addIn(-this.width/2, y, len, 'I3');
    y += 16;
    this.addIn(-this.width/2, y, len, 'I2');
    y += 16;
    this.addIn(-this.width/2, y, len, 'I1');
    y += 16;
    this.addIn(-this.width/2, y, len, 'I0');
    y += 32;

    this.addIn(-this.width/2, y, len, 'I').bus = true;

    // 7 outputs
    y = -16 * 3 - 8;
    len = 16;

    this.addOut(this.width/2, y, len, "a");
    y += 16;
    this.addOut(this.width/2, y, len, "b");
    y += 16;
    this.addOut(this.width/2, y, len, "c");
    y += 16;
    this.addOut(this.width/2, y, len, "d");
    y += 16;
    this.addOut(this.width/2, y, len, "e");
    y += 16;
    this.addOut(this.width/2, y, len, "f");
    y += 16;
    this.addOut(this.width/2, y, len, "g");
    y += 16;
};

HexToSevenSegment.prototype = Object.create(Component.prototype);
HexToSevenSegment.prototype.constructor = HexToSevenSegment;

HexToSevenSegment.prototype.prefix = "D";

HexToSevenSegment.type = "HexToSevenSegment";            ///< Name to use in files
HexToSevenSegment.label = "Hex to Seven Segment";           ///< Label for the palette
HexToSevenSegment.desc = "Hexadecimal to Seven Segment Decoder";       ///< Description for the palette
HexToSevenSegment.img = null;                       ///< Image to use for the palette
HexToSevenSegment.description = '<h2>Hex to Seven Segement</h2>' +
    '<p>Decodes hexadecimal into the correct outputs for a seven-segment display. Accepts either' +
    ' single bit lines or bus input.</p>';
HexToSevenSegment.order = 506;

/**
 * Compute the gate result
 * @param state
 */
HexToSevenSegment.prototype.compute = function(state) {
    var a = state[0];
    var b = state[1];
    var c = state[2];
    var d = state[3];
    if(a === undefined || b === undefined || c === undefined || d === undefined) {
        if(state[4] !== undefined) {
            var bus = state[4];
            a = bus[3];
            b = bus[2];
            c = bus[1];
            d = bus[0];
        }
    }

    if(a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
        var i = (a ? 8 : 0) + (b ? 4 : 0) + (c ? 2 : 0) + (d ? 1 : 0);

        var mapping = [
            [true, true, true, true, true, true, false],    // 0
            [false, true, true, false, false, false, false],// 1
            [true, true, false, true, true, false, true],   // 2
            [true, true, true, true, false, false, true],   // 3
            [false, true, true, false, false, true, true],  // 4
            [true, false, true, true, false, true, true],   // 5
            [true, false, true, true, true, true, true],    // 6
            [true, true, true, false, false, false, false], // 7
            [true, true, true, true, true, true, true],     // 8
            [true, true, true, true, false, true, true],    // 9
            [true, true, true, false, true, true, true],    // a
            [false, false, true, true, true, true, true],   // b
            [true, false, false, true, true, true, false],  // c
            [false, true, true, true, true, false, true],   // d
            [true, false, false, true, true, true, true],   // e
            [true, false, false, false, true, true, true]   // f
        ];

        var m = mapping[i];
        for(a=0; a<7; a++) {
            this.outs[a].set(m[a]);
        }
    } else {
        for(a=0; a<7; a++) {
            this.outs[a].set(undefined);
        }
    }
};

/**
 * Clone this component object.
 * @returns {HexToSevenSegment}
 */
HexToSevenSegment.prototype.clone = function() {
    var copy = new HexToSevenSegment();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
HexToSevenSegment.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    this.drawBox(context);
    this.drawName(context, 0, 3);
    this.drawText(context, "Hex-to-7", 0, this.height/2- 5);
    this.drawIO(context, view);
};

/**
 * Create a PaletteImage object for a the component
 */
HexToSevenSegment.paletteImage = function() {
    var pi = new PaletteImage(60, 44);

    pi.box(20, 40);
    pi.io(-10, -15.5, 'w', 4, 5);
    pi.io(10, -15.5, 'e', 7, 5);

    const lw = pi.context.lineWidth;
    pi.context.lineWidth = 2;
    pi.io(-10, 15.5, 'w');
    pi.context.lineWidth = lw;

    pi.drawText("Hex-to-7", 0, 18, "4px Times");

    return pi;
}
