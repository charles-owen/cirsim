import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Value} from '../Value';
import {Sanitize} from '../Utility/Sanitize';

/**
 * Component: InPinBus gate
 * An input pin for Bus inputs
 * @constructor
 */
export const InPinBus = function() {
    Component.call(this);

    this.height = 16;
    this.width = 96;
    this.narrow = false;

    this.value = new Value();

    // One output
    this.addOut(48, 0, 16).bus=true;
    this.set([false, false, false, false]);
};

InPinBus.prototype = Object.create(Component.prototype);
InPinBus.prototype.constructor = InPinBus;

InPinBus.prototype.prefix = "I";
InPinBus.prototype.nameRequired = true;

InPinBus.type = "InPinBus";         ///< Name to use in files
InPinBus.label = "Bus Input";       ///< Label for the palette
InPinBus.desc = "Bus Input Pin";    ///< Description for the palette
InPinBus.img = "inpinbus.png";      ///< Image to use for the palette
InPinBus.order = 300;               ///< Order of presentation in the palette
InPinBus.description = '<h2>Bus Input Pin</h2><p>A Bus Input pin serves as input ' +
    'for a circuit from a bus. Double-click to set the value.</p>' +
    '<p>Values can be preceeded by 0x or 0b for hexadecimal or binary ' +
    'values.</p>' +
    '<p>The display and input format is selectable. Auto format will display values ' +
    'with eight or fewer digits as binary and larger values in hex.</p>';
InPinBus.help = 'inpinbus';

/**
 * Clone this component object.
 * @returns {InPinBus}
 */
InPinBus.prototype.clone = function() {
    var copy = new InPinBus();
    copy.copyFrom(this);
    copy.value = this.value.clone();
    return copy;
};

/**
 * Compute.
 *
 * Force the output to the current set value.
 * Since there are no inputs, state is ignored.
 * @param state
 */
InPinBus.prototype.compute = function(state) {
    this.outs[0].set(this.value.get());
};

/**
 * Draw the component.
 * @param context Display context
 * @param view View object
 */
InPinBus.prototype.draw = function(context, view) {
    // Component background
    this.outlinePath(context);
    context.fillStyle = "#dddddd";
    context.fill();

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    let x = this.x;
    if(this.narrow) {
        // Some adjustments of the X location
        // to make the narrow presentation look nicer
        x = this.x - this.height / 4 + 1;
    }

    this.value.draw(context,
        x,
        this.y,
        this.width - this.height / 2,
        this.naming);

    this.drawIO(context, view);
};

InPinBus.prototype.outlinePath = function(context) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);
    context.lineTo(rightX - this.height/2, botY);
    context.lineTo(rightX, this.y);
    context.lineTo(rightX - this.height/2, topY);
    context.lineTo(leftX, topY);
};

/**
 * Set the value for the input
 * @param value true for on
 */
InPinBus.prototype.set = function(value) {

    if(Array.isArray(value)) {
        this.value.set(value);
    } else if (typeof value === 'string' || value instanceof String) {
        this.value.setAsString(value);
    }

    this.outs[0].set(this.value.get());
};

InPinBus.prototype.get = function() {
    return this.value.get();
};

InPinBus.prototype.setAsString = function(value, parseonly) {
    this.value.setAsString(value, parseonly);
    if (!parseonly) {
        this.outs[0].set(this.value.get());
    }
}

InPinBus.prototype.getAsString = function() {
    return this.value.getAsString();
};

/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
InPinBus.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    this.value.save(obj);
    if(this.narrow) {
        obj.narrow = this.narrow;
    }
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
InPinBus.prototype.load = function(obj) {
    this.value.load(obj);
    this.setNarrow(Sanitize.boolean(obj.narrow));
    Component.prototype.load.call(this, obj);
};

InPinBus.prototype.properties = function(main) {

    let dlg = new ComponentPropertiesDlg(this, main);
    let id = dlg.uniqueId();

    let content = this.value.dialogContent(dlg, true);
    let html = content.html + `<input type="checkbox" id="${id}" name="${id}"${this.narrow ? " checked" : ""}> <label for="${id}">Narrow</label>`;

    dlg.extra(html, content.validate, () => {
        content.accept();

        this.setNarrow(document.getElementById(id).checked);
        this.compute(null);
    });

    dlg.open();
};


InPinBus.prototype.setNarrow = function(narrow) {
    this.narrow = narrow;
    this.width = narrow ? 48 : 96;
    this.outs[0].x = this.width/2;
}
