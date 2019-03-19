import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: Extend
 * The Extend component extends an input bus to
 * a larger output size.
 *
 * A common use is extending a 12 bit immediate value to
 * 16 or 32 bits.
 *
 * @constructor
 * @property {number} height Component height
 * @property {number} width Component width
 * @property {number} outputSize Number of output bits
 * @property {boolean} arithmetic Sign extend expansion
 */
export const Extend = function() {
    Component.call(this);

    //
    // Object properties
    //
    Object.defineProperties(this, {
        // Component height
        height: {
           value: 32
        },
        /** Component width */
        width: {
           value: 96
        },
        outputSize: {
            value: 16,
            writable: true
        },
        arithmetic: {
            value: false,
            writable: true
        },
        shift: {
            value: 0,
            writable: true
        }
    });

    // One input
    this.addIn(-48, 8, 16).bus=true;

    // One output
    this.addOut(48, 0, 16).bus=true;
};

Extend.prototype = Object.create(Component.prototype);
Extend.prototype.constructor = Extend;

Extend.prototype.prefix = null;

Extend.type = "Extend";        ///< Name to use in files
Extend.label = "Extend";          ///< Label for the palette
Extend.desc = "Bus Extend";    ///< Description for the palette
Extend.description = `<h2>Extend</h2><p>The Extend component extends a 
bus to a larger size. A common use is to extend an immediate value 
from an instruction to 16 or 32 bits.</p>
<p>The output can be optionally shifted left by a fixed number of bits.</p>`;
Extend.order = 311;
Extend.help = 'extend';

/**
 * Clone this component object.
 * @returns {Extend}
 */
Extend.prototype.clone = function() {
    const copy = new Extend();
    copy.copyFrom(this);
    copy.outputSize = this.outputSize;
    copy.arithmetic = this.arithmetic;
    copy.shift = this.shift;
    return copy;
};

/**
 * Compute.
 *
 * Force the output to the current set value.
 * Since there are no inputs, state is ignored.
 * @param state
 */
Extend.prototype.compute = function(state) {
    // Test for the state undefined
    if(state[0] === undefined) {
        this.outs[0].set(undefined);
        return;
    }

    // Bus output
    const value = [];
    let i=0;

    // Shift amount
    for( ; i<this.shift; i++) {
        value.push(0);
    }

    // Move the bits
    let inBit = 0;
    let lastBit = 0;
    for( ; inBit < state[0].length && i<this.outputSize; inBit++, i++) {
        value.push(state[0][inBit]);
        lastBit = state[0][inBit];
    }

    // Expand
    for( ; i<this.outputSize;  i++) {
        value.push(this.arithmetic ? lastBit : 0);
    }

    this.outs[0].set(value);
};

/**
 * Draw the component.
 * @param context Display context
 * @param view View object
 */
Extend.prototype.draw = function(context, view) {
    // Component background
    this.outlinePath(context);
    context.fillStyle = "#ffffff";
    context.fill();

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    //this.outlinePath(context);
    context.stroke();

    context.font = "14px Times";
    context.textAlign = "center";

    context.fillText("Extend", this.x, this.y + 10);

    this.drawIO(context, view);
};

Extend.prototype.outlinePath = function(context) {
    const leftX = this.x - this.width/2 - 0.5;
    const rightX = this.x + this.width/2 + 0.5;
    const topY = this.y - this.height/2 - 0.5;
    const leftTopY = this.y - 0.5;
    const botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, leftTopY);
    context.lineTo(leftX, botY);
    context.lineTo(rightX, botY);
    context.lineTo(rightX, topY);
    context.lineTo(leftX, leftTopY);

};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Extend.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    obj.outputSize = this.outputSize;
    obj.arithmetic = this.arithmetic;
    obj.shift = this.shift;
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Extend.prototype.load = function(obj) {
    this.outputSize = obj['outputSize'];
    this.arithmetic = obj['arithmetic'];
    this.shift = obj['shift'];
    Component.prototype.load.call(this, obj);
};

Extend.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const outputId = dlg.uniqueId();
    const arithId = dlg.uniqueId();
    const shiftId = dlg.uniqueId();

    var html = `<div class="control1 center gap">
<label>Output size (bits): 
<input class="number" type="text" name="${outputId}" id="${outputId}" value="${this.outputSize}" spellcheck="false" onfocus="this.select()">
</label>
</div>
<div class="control1 center gap">
<label>Output shift (bits): 
<input class="number" type="text" name="${shiftId}" id="${shiftId}" value="${this.shift}" spellcheck="false" onfocus="this.select()">
</label>
</div>
<div class="control1 center gap">
<label for="${arithId}"><input type="checkbox" id="${arithId}" name="${arithId}"${this.arithmetic ? " checked" : ""}> Arithmetic extend</label>
</div>`;

    dlg.extra(html, () => {
        const outputStr = document.getElementById(outputId).value;
        const output = parseInt(outputStr);
        if(isNaN(output) || output < 1 || output > 32) {
	        document.getElementById(outputId).select();
            return "Invalid output size, must be 1 to 32";
        }

        const shiftStr = document.getElementById(shiftId).value;
        const shift = parseInt(outputStr);
        if(isNaN(shift) || shift < 0 || shift > output) {
            document.getElementById(shiftId).select();
            return "Invalid shift size, must be 0 to the bit size.";
        }

        return null;
    }, () => {
        this.arithmetic = document.getElementById(arithId).checked;
        const outputStr = document.getElementById(outputId).value;
        this.outputSize = parseInt(outputStr);
        const shiftStr = document.getElementById(shiftId).value;
        this.shift = parseInt(shiftStr);
        this.pending();
    });

    dlg.open();
    document.getElementById(outputId).select();
};

/**
 * Create a PaletteImage object for a the component
 */
Extend.paletteImage = function() {
    const pi = new PaletteImage(60, 44);

    const wid = 40;
    const hit = 16;

    const x = pi.width/2;
    const y = pi.height/2;

    const leftX = x - wid/2 - 0.5;
    const rightX = x + wid/2 + 0.5;
    const topY = y - hit/2 - 0.5;
    const leftTopY = y;
    const botY = y + hit/2 + 0.5;

    pi.context.beginPath();
    pi.context.moveTo(leftX, leftTopY);
    pi.context.lineTo(rightX, topY);
    pi.context.lineTo(rightX, botY);
    pi.context.lineTo(leftX, botY);
    pi.context.lineTo(leftX, leftTopY);

    pi.fillStroke();

    pi.io(20, 0, 'e');

    pi.io(-20, 4, 'w');
    pi.drawText("Extend", 0, 7, "8px Times");

    return pi;
}
