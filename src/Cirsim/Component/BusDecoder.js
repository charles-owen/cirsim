
import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: General purpose BUS decoder
 * @param name Component name
 * @constructor
 */
export const BusDecoder = function(name) {
    Component.call(this, name);

    this.height = 100;
    this.width = 52;
    this.lastOut = null;

    this.setSize(3);

    // Size output and one input
    this.circuitOuts = [];
    this.addIn(-this.width/2, 0, 16, "In").bus = true;
    this.ensureIO();
};

BusDecoder.prototype = Object.create(Component.prototype);
BusDecoder.prototype.constructor = BusDecoder;

BusDecoder.prototype.prefix = 'U';

BusDecoder.type = "BusDecoder";            ///< Name to use in files
BusDecoder.label = "Bus Decoder";           ///< Label for the palette
BusDecoder.desc = "Configurable Bus Decoder";       ///< Description for the palette
BusDecoder.description = `<h2>Bus Decoder</h2>
<p>The Bus Decoder component converts a 2 to 4-bit binary value on <strong>In</strong> 
to a true on one of four to sixteen output lines. The number of outputs is determined 
by the bit size and is configurable.</p>`;
BusDecoder.order = 109;
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
    if(Array.isArray(state[0])) {
        let c = 0;
        let pow = 1;
        for(let i=0; i<state[0].length; i++) {
            c += (state[0][i] ? pow : 0);
            pow *= 2;
        }

        for(let i=0; i<this.outputs; i++) {
            this.outs[i].set(i == c);
        }

        this.lastOut = c;

    } else {
        for(var i=0; i<this.outputs; i++) {
            this.outs[i].set(undefined);
        }

        this.lastOut = null;
    }
};



/**
 * Clone this component object.
 * @returns {BusDecoder}
 */
BusDecoder.prototype.clone = function() {
    var copy = new BusDecoder();
    copy.setSize(this.size);
    copy.copyFrom(this);
    return copy;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
BusDecoder.prototype.ensureIO = function() {
    var spacing = 16;

    this.height = this.outputs * spacing + 26;
    if(this.height < 80) {
        this.height = 80;
    }

    var x = this.width / 2;

    var startY = this.outputs / 2 * spacing - 8;

    for(var i=0; i<this.outputs; i++) {
        if(i >= this.outs.length) {
            break;
        }

        this.outs[i].name = "O" + i;
        this.outs[i].x = x;
        this.outs[i].y = startY - i * spacing;
        this.outs[i].len = 16;
    }

    // Add any new pins
    for(; i<this.outputs; i++) {
        this.addOut(x, startY - i * spacing, 16, "O" + i);
    }

    // Delete pins that have ceased to exist
    if(i < this.outs.length) {
        for( ; i<this.outs.length; i++) {
            this.outs[i].clear();
        }

        this.outs.splice(this.outputs);
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

    if(this.lastOut !== null && this.lastOut >= 0 && this.lastOut < this.outputs) {
        let y = this.outs[this.lastOut].y;
        let rx = this.lastOut >= 10 ? 26 : 19;
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
    this.setSize(obj["size"]);
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusDecoder.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    return obj;
};

BusDecoder.prototype.properties = function(main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    var id = dlg.uniqueId();
    var html = `<div class="control1 center"><label for="${id}">Size (bits): </label>
<input class="number" type="text" name="${id}" id="${id}" value="${this.size}"></div>`;

    dlg.extra(html, function() {
        var size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 4) {
            return "Size must be an integer from 2 to 4";
        }
        return null;
    }, () => {
        this.setSize(document.getElementById(id).value);
    });

    dlg.open();
};

/**
 * Create a PaletteImage object for a the component
 */
BusDecoder.paletteImage = function() {
    var pi = new PaletteImage(60, 44);

    pi.box(20, 42);
    pi.io(10, -17.5, 'e', 8, 5);

    pi.io(-10, 0, 'w');
    pi.drawText("Decoder", 0, 20, "4px Times");

    return pi;
}


