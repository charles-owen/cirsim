import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Convert bus into single-bit signals
 * @constructor
 */
export const FmBus = function() {
    Component.call(this);

    this.height = 80;
    this.width = 32;

    // Size in bits
    this.size = 4;

    // Size output and one input
    this.circuitOuts = [];
    this.addIn(-this.width/2, 0, this.pinlength, "I").bus = true;

    this.ensureIO();
};

FmBus.prototype = Object.create(Component.prototype);
FmBus.prototype.constructor = FmBus;

FmBus.prototype.prefix = null;
FmBus.prototype.indent = 10;
FmBus.prototype.pinlength = 8;

FmBus.type = "FmBus";            ///< Name to use in files
FmBus.label = "Fm Bus";           ///< Label for the palette
FmBus.desc = "Bus to Single bits";       ///< Description for the palette
FmBus.img = "fmbus.png";         ///< Image to use for the palette
FmBus.order = 48;               ///< Order of presentation in the palette
FmBus.description = '<h2>To Bus</h2><p>Converts a bus input into single bit ' +
    'outputs. This allows for simpler circuits.</p>';

/**
 * Compute the gate result
 * @param state
 */
FmBus.prototype.compute = function(state) {
    if(Array.isArray(state[0])) {
        for(var i=0; i<this.size && i<state[0].length; i++) {
            this.outs[i].set(state[0][i]);
        }

        for( ; i<this.size; i++) {
            this.outs[i].set(undefined);
        }
    } else {
        for(var i=0; i<this.size; i++) {
            this.outs[i].set(undefined);
        }
    }
};

/**
 * Clone this component object.
 * @returns {FmBus}
 */
FmBus.prototype.clone = function() {
    var copy = new FmBus();
    copy.size = this.size;
    copy.ensureIO();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
FmBus.prototype.load = function(obj) {
    this.size = obj["size"];
    this.ensureIO();
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
FmBus.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    return obj;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
FmBus.prototype.ensureIO = function() {
    var spacing = 16;

    this.height = this.size * spacing + 16;
    if(this.height < 48) {
        this.height = 48;
    }

    var x = this.width / 2;

    var startY = this.size / 2 * spacing - 8;

    for(var i=0; i<this.size; i++) {
        if(i >= this.outs.length) {
            break;
        }

        this.outs[i].name = "O" + i;
        this.outs[i].x = x;
        this.outs[i].y = startY - i * spacing;
        this.outs[i].len = this.pinlength;
    }

    // Add any new pins
    for(; i<this.size; i++) {
        this.addOut(x, startY - i * spacing, this.pinlength, "O" + i);
    }

    // Delete pins that have ceased to exist
    if(i < this.outs.length) {
        for( ; i<this.outs.length; i++) {
            this.outs[i].clear();
        }

        this.outs.splice(this.size);
    }
}

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
FmBus.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    this.drawTrap(context, this.indent, 0);
    this.drawIO(context, view);
};


FmBus.prototype.properties = function(main) {
    var that = this;

    var dlg = new ComponentPropertiesDlg(this, main);
    var id = dlg.uniqueId();

    var html =
        '<div class="control1 center gap"><label for="' + id + '">Size: </label><input class="number" type="text" id="' + id + '" value="' + this.size +
        '"></div>';

    dlg.extra(html, function() {
        var size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 16) {
            return "Size must be an integer from 2 to 16";
        }
        return null;
    }, function() {
        that.size = parseInt(document.getElementById(id).value);
        that.ensureIO();
        that.pending();
    });

    dlg.open();
    document.getElementById(id).select();
};
