import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: n-to-1 Multiplexer
 *
 * Works for both busses and single-bit inputs.
 * @constructor
 */
export const BusMultiplexer = function() {
    Component.call(this);

    this.height = 80;
    this.width = 32;

    // Number of inputs
    this.size = 2;
    this.lastIn = null;
    this.bus = true;

    // Size inputs and one output
    this.circuitIns = [];
    this.addOut(this.width/2, 0, 8, "O").bus = true;
    const inp = this.addIn(0, -this.height / 2 + 10, 13, "");
    inp.orientation = "n";

    this.ensureIO();
};

BusMultiplexer.prototype = Object.create(Component.prototype);
BusMultiplexer.prototype.constructor = BusMultiplexer;

BusMultiplexer.prototype.prefix = null;
BusMultiplexer.prototype.indent = 10;

BusMultiplexer.type = "Multiplexer";            ///< Name to use in files
BusMultiplexer.label = "Multiplexer";           ///< Label for the palette
BusMultiplexer.desc = "Multiplexer";       ///< Description for the palette
BusMultiplexer.img = "multiplexer.png";         ///< Image to use for the palette
BusMultiplexer.description = `<h2>Multiplexer</h2><p>Multiplexes 2 to 16 inputs to a single output. The 
inputs and outputs and can be configured as buses or single bits.</p>
<p>The value of the input pin or bus determines which input is routed to O. The input will be a single
bit if there are two choices (binary) or a bus if there are more than 2 choices. </p>`;
BusMultiplexer.order = 402;
BusMultiplexer.help = 'multiplexer';

/**
 * Compute the gate result
 * @param state
 */
BusMultiplexer.prototype.compute = function(state) {
    // Which input?
    var in0 = state[0];
    if(in0 === undefined) {
        this.outs[0].set(undefined);
        this.lastIn = null;
        return;
    }

    if(Array.isArray(in0)) {
        var in0a = 0;
        var in0p = 1;
        in0.forEach(function(i) {
            if(i) {
                in0a += in0p;
            }

            in0p *= 2;
        })

        in0 = in0a;
    } else {
        in0 = in0 ? 1 : 0;
    }

    if(in0 <= state.length) {
        this.outs[0].set(state[in0+1]);
        this.lastIn = in0;
    } else {
        this.outs[0].set(undefined);
        this.lastIn = null;
    }
};

/**
 * Clone this component object.
 * @returns {BusMultiplexer}
 */
BusMultiplexer.prototype.clone = function() {
    const copy = new BusMultiplexer();
    copy.size = this.size;
    copy.bus = this.bus;
    copy.ensureIO();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
BusMultiplexer.prototype.load = function(obj) {
    this.size = obj["size"];
    this.bus = obj["bus"] !== false;
    this.ensureIO();
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusMultiplexer.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    obj.bus = this.bus;
    return obj;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
BusMultiplexer.prototype.ensureIO = function() {
    if(this.bus !== this.outs[0].bus) {
        this.outs[0].clear();
        this.outs[0].bus = this.bus;

        // Clear the inputs after the first one (selector)
        for(i=1; i<this.ins.length; i++) {
            this.ins[i].clear();
        }

        this.ins.splice(1, this.ins.length-1);
    }

    const spacing = 16;

    this.height = this.size * spacing + 16;
    if(this.height < 48) {
        this.height = 48;
    }

    var x = this.width / 2;

    var in0 = this.ins[0];
    in0.x = 0;
    in0.y = -this.height / 2 + this.indent / 2;
    in0.bus = this.size > 2;

    var startY = this.size / 2 * spacing - 8;

    for(var i=0; i<this.size; i++) {
        if(i >= (this.ins.length - 1)) {
            break;
        }

        var ins = this.ins[i+1];
        ins.name = "I" + i;
        ins.x = -x;
        ins.y = startY - i * spacing;
        ins.len = 8;
    }

    // Add any new pins
    for(; i<this.size; i++) {
        this.addIn(-x, startY - i * spacing, 8, "I" + i).bus = this.bus;
    }

    // Delete pins that have ceased to exist
    i++;
    if(i < this.ins.length) {
        for( ; i<this.ins.length; i++) {
            this.ins[i].clear();
        }

        this.ins.splice(this.size+1);
    }
}

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
BusMultiplexer.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    this.drawTrap(context, 0, this.indent);

    if(this.lastIn !== null) {
        const spacing = 16;

        const x1 = this.x - 4;
        const x2 = this.x + 4;
        const y2 = this.y - 1;

        const startY = this.y + this.size / 2 * spacing - 10;
        const y1 = startY - this.lastIn * 16;

        this.jaggedLine(context, x1, y1, x2, y2, 0.5);
    }


    this.drawIO(context, view);
};


BusMultiplexer.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();
    let html = `<div class="control1 center gap"><label for="${id}">Number of inputs: </label>
<input class="number" type="text" name="${id}" id="${id}" value="${this.size}"></div>`;

    html += '<div class="control center"><div class="choosers">';

    const busId = dlg.uniqueId();
    html += `
<label><input type="radio" name="${busId}"  ${this.bus ? 'checked' : ''} value="1"> Bus</label>
<label><input type="radio" name="${busId}" ${!this.bus ? 'checked' : ''} value="0"> Single Bit</label>`;

    html += '</div></div>';

    dlg.extra(html, () => {
        const size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 16) {
	        document.getElementById(id).select();
            return "Must be an integer from 2 to 16";
        }
        return null;
    }, () => {
        this.size = parseInt(document.getElementById(id).value);
        this.bus = document.querySelector(`input[name=${busId}]:checked`).value === '1';
        this.ensureIO();
    });

    dlg.open();
};
