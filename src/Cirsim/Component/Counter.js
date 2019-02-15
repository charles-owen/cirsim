import {Util} from '../Utility/Util';
import {Component} from '../Component';
import {ComponentPropertiesDlg} from "../Dlg/ComponentPropertiesDlg";
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: Simple arbitrary bit size counter.
 */
export const Counter = function() {
    Component.call(this);

    this.height = 98;
    this.width = 48;
    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.value = 0;
    this.size = 16;

    this.lastClk = false;

    const clk = this.addIn(0, -h2, 8);
    clk.orientation = 'n';
    clk.clock = true;

    this.addIn(-w2, -24, 8, "UP");
    const res = this.addIn(0, h2, 8, "R");
    res.orientation = 's';

    this.addOut(w2, -24, 8, "C").bus = true;

    this.set(0);
};

Counter.prototype = Object.create(Component.prototype);
Counter.prototype.constructor = Counter;
Counter.prototype.prefix = "C";

Counter.type = "Counter";            ///< Name to use in files
Counter.label = "Counter";           ///< Label for the palette
Counter.desc = "Simple Counter";       ///< Description for the palette
Counter.description = `<h2>Simple Counter</h2><p>Supports up and down counting for 
arbitrary bit sizes. C is the count output. The optional UP input controls the counting
direction. True means up counting. If not connected, the counter counts up. R is an 
asynchronous reset. The counter increments or decrements on the clock leading edge.</p>`;
Counter.order = 406;
Counter.help = 'Counter';

/**
 * Compute the gate result
 * @param state
 */
Counter.prototype.compute = function(state) {
    if(state[2]) {
        // Reset!
        this.set(0);
    } else {
        if(state[0] && !this.lastClk) {
            // Clock leading edge
            if(state[1] !== false) {
                this.set(this.value + 1);
            } else {
                this.set(this.value - 1);
            }
        }
    }



    this.lastClk = state[0];
};

Counter.prototype.set = function(value) {
    this.value = value;

    let and = 0;
    for(let i=0; i<this.size; i++) {
        and = (and << 1) | 1;
    }

    this.value &= and;

    let o = this.value;
    let data = [];
    for(let i=0; i<this.size; i++) {
        data.push((o & 1) == 1);
        o >>= 1;
    }

    this.outs[0].set(data);
}

/**
 * Clone this component object.
 * @returns {Counter}
 */
Counter.prototype.clone = function() {
    const copy = new Counter();
    copy.size = this.size;
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Counter.prototype.load = function(obj) {
    this.size = obj["size"];
    Component.prototype.load.call(this, obj);
    this.set(0);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Counter.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    obj.size = this.size;
    return obj;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Counter.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    this.drawBox(context);

    let y = this.y;

    context.font = '14px "Lucida Console", Monaco, monospace';
    context.textAlign = "center";

    // Where does the text start?
    if(this.size > 12) {
        context.fillText(Util.toHex(this.value, 4), this.x, y);
    } else if(this.size > 8) {
        context.fillText(Util.toHex(this.value, 3), this.x, y);
    } else if(this.size > 4) {
        context.fillText(Util.toHex(this.value, 2), this.x, y);
    } else {
        context.fillText(Util.toBinary(this.value, this.size), this.x, y);
    }


    y += 25;
    context.font = "14px Times";

    context.fillText("counter", this.x, y);
    this.drawIO(context, view);
};


Counter.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();
    let html = `<div class="control1 center gap"><label for="${id}">Size in bits: </label>
<input class="number" type="text" name="${id}" id="${id}" value="${this.size}"></div>`;

    dlg.extra(html, () => {
        const size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 16) {
            document.getElementById(id).select();
            return "Must be an integer from 2 to 16";
        }
        return null;
    }, () => {
        this.size = parseInt(document.getElementById(id).value);
        this.set(this.value);
    });

    dlg.open();
};


/**
 * Create a PaletteImage object for a the component
 */
Counter.paletteImage = function() {
    const pi = new PaletteImage(60, 44);

    pi.box(16, 32);
    pi.io(8, -8, 'e');
    pi.io(-8, -8, 'w');

    // Reset
    pi.io(0, 16, 's');

    // Clock
    pi.clock(0, -16, 'n');

    pi.drawText("0000", 0, 2, "6px Times");
    pi.drawText("Counter", 0, 10, "4px Times");


    return pi;
}
