
import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: General purpose decoder.
 *
 * Supports bus or single-bit inputs.
 * @constructor
 */
export const BusDecoder = function() {
    Component.call(this);

    this.height = 100;
    this.width = 52;
    this.value = null;

    let bus = true;

    Object.defineProperty(this,"bus",{
        get: function() { return bus; },
        set: function(value) {
            if(bus !== value) {
                if(this.ins[0].bus !== value) {
                    for(let i=0; i<this.ins.length; i++) {
                        this.ins[i].clear();
                    }

                    this.ins = [];
                }

                bus = value;
                this.ensureIO();
            }

        }
    });

    this.setSize(3);

    // Size output and one input
    this.circuitOuts = [];
    this.ensureIO();
};

BusDecoder.prototype = Object.create(Component.prototype);
BusDecoder.prototype.constructor = BusDecoder;

BusDecoder.prototype.prefix = 'U';

BusDecoder.type = "BusDecoder";            ///< Name to use in files
BusDecoder.label = "Decoder";           ///< Label for the palette
BusDecoder.desc = "Configurable Decoder";       ///< Description for the palette
BusDecoder.description = `<h2>Decoder</h2>
<p>The Decoder component converts a 2 to 4-bit binary value on <strong>In</strong> 
to a true on one of four to sixteen output lines. The number of outputs is determined 
by the bit size and is configurable.</p>`;
BusDecoder.order = 400;
BusDecoder.help = 'busdecoder';

BusDecoder.prototype.setSize = function(size) {
    this.size = size;
    this.outputs = 1;
    for(let i=0; i<size; i++) {
        this.outputs *= 2;
    }

    this.ensureIO();
}

/**
 * Compute the gate result
 * @param state
 */
BusDecoder.prototype.compute = function(state) {
    if(this.bus) {
        if(Array.isArray(state[0])) {
            let c = 0;
            let pow = 1;
            for(let i=0; i<state[0].length; i++) {
                c += (state[0][i] ? pow : 0);
                pow *= 2;
            }

            this.set(c);
        } else {
            this.set(null);
        }
    } else {
        let c = 0;
        let pow = 1;
        let undef = false;
        for(let i=0; i<state.length; i++) {
            if(state[i] === undefined) {
                undef = true;
                break;
            }

            c += (state[i] ? pow : 0);
            pow *= 2;
        }

        this.set(undef ? null : c);
    }

};

/**
 * Set the value of this component.
 * @param c Value to set.
 */
BusDecoder.prototype.set = function(c) {
    if(c !== null && c !== undefined) {
        c = c & (this.outputs - 1);
        for(let i=0; i<this.outputs; i++) {
            this.outs[i].set(i == c);
        }
    } else {
        for(let i=0; i<this.outputs; i++) {
            this.outs[i].set(undefined);
        }
    }

    this.value = c;
}



/**
 * Clone this component object.
 * @returns {BusDecoder}
 */
BusDecoder.prototype.clone = function() {
    const copy = new BusDecoder();
    copy.bus = this.bus;
    copy.setSize(this.size);
    copy.copyFrom(this);
    return copy;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
BusDecoder.prototype.ensureIO = function() {
    const spacing = 16;
    const pinLen = 14;
    let i;
    let recompute = false;

    this.height = this.outputs * spacing + 26;
    if(this.height < 80) {
        this.height = 80;
    }

    //
    // Inputs
    //
    if(this.ins.length > 0) {
        //
        // Test if we switched input types
        // If so, disconnect everything and zero the inputs
        //
        if(this.ins[0].bus !== this.bus) {
            for(i=0; i<this.ins.length; i++) {
                this.ins[i].clear();
            }

            this.ins = [];
        }
    }

    if(this.bus) {
        if(this.ins.length < 1) {
            this.addIn(-this.width / 2, 0, pinLen, "In").bus = true;
            recompute = true;
        }
    } else {
        let startY = this.size / 2 * spacing - 8;

        for(i=0; i<this.size; i++) {
            let pinY = startY - i * spacing;

            let inp = null;
            if(i < this.ins.length) {
                inp = this.ins[i];

                inp.x = -this.width / 2;
                inp.y = pinY;
                inp.len = pinLen;
            } else {
                // Add any new pins
                inp = this.addIn(-this.width / 2, pinY, pinLen, "I" + i);
                recompute = true;
                inp.orientation = 'w';
            }
        }

        // Delete pins that have ceased to exist
        if(i < this.ins.length) {
            for( ; i<this.ins.length; i++) {
                this.ins[i].clear();
            }

            this.ins.splice(this.size);
        }
    }


    //
    // Outputs
    //
    let x = this.width / 2;

    let startY = this.outputs / 2 * spacing - 8;

    for(i=0; i<this.outputs; i++) {
        if(i >= this.outs.length) {
            break;
        }

        this.outs[i].name = "O" + i;
        this.outs[i].x = x;
        this.outs[i].y = startY - i * spacing;
        this.outs[i].len = pinLen;
    }

    // Add any new pins
    for(; i<this.outputs; i++) {
        this.addOut(x, startY - i * spacing, pinLen, "O" + i);
        recompute = true;
    }

    // Delete pins that have ceased to exist
    if(i < this.outs.length) {
        for( ; i<this.outs.length; i++) {
            this.outs[i].clear();
        }

        this.outs.splice(this.outputs);
    }

    if(recompute) {
        this.set(this.value);
    }
}

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
BusDecoder.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    this.drawBox(context);

    context.font = "12px Times";
    context.textAlign = "center";
    context.fillText("decoder", this.x, this.y + this.height/2 - 2);

    if(this.value !== null && this.value >= 0 && this.value < this.outputs) {
        let y = this.outs[this.value].y;
        let rx = this.value >= 10 ? 26 : 19;
        this.jaggedLine(context, leftX + 15, this.y, rightX - rx, this.y + y, 0.5);
    }


    this.drawName(context, 0, -this.height/2 + 12);
    this.drawIO(context, view);
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
BusDecoder.prototype.load = function(obj) {
    this.bus = obj["bus"] !== false;
    this.setSize(obj["size"]);
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusDecoder.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    obj.size = this.size;
    obj.bus = this.bus;
    return obj;
};

BusDecoder.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();
    let html = `<div class="control1 center"><label for="${id}">Size (bits): </label>
<input class="number" type="text" name="${id}" id="${id}" value="${this.size}"></div>`;

    html += '<div class="control center"><div class="choosers">';

    const busId = dlg.uniqueId();
    html += `
<label><input type="radio" name="${busId}"  ${this.bus ? 'checked' : ''} value="1"> Bus Input</label>
<label><input type="radio" name="${busId}" ${!this.bus ? 'checked' : ''} value="0"> Single Bit Inputs</label>`;

    html += '</div></div>';

    dlg.extra(html, function() {
        const size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 4) {
            return "Size must be an integer from 2 to 4";
        }
        return null;
    }, () => {
        this.setSize(document.getElementById(id).value);
        this.bus = document.querySelector(`input[name=${busId}]:checked`).value === '1';
    });

    dlg.open();
};

/**
 * Create a PaletteImage object for a the component
 */
BusDecoder.paletteImage = function() {
    const pi = new PaletteImage(60, 44);

    pi.box(20, 42);
    pi.io(10, -17.5, 'e', 8, 5);

    pi.io(-10, 0, 'w');
    pi.drawText("Decoder", 0, 20, "4px Times");

    return pi;
}


