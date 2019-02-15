
import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Value} from '../Value';

/**
 * Component: BusConstant gate
 * A constant bus value component.

 * @constructor
 */
export const BusConstant = function() {
    Component.call(this);

    this.height = 16;
    this.width = 96;

    this.value = new Value();

    // One output
    this.addOut(48, 0, 16).bus=true;
    this.set([false, false, false, false]);
};

BusConstant.prototype = Object.create(Component.prototype);
BusConstant.prototype.constructor = BusConstant;

BusConstant.prototype.prefix = null;

BusConstant.type = "BusConstant";        ///< Name to use in files
BusConstant.label = "Bus Constant";          ///< Label for the palette
BusConstant.desc = "Bus Constant value";    ///< Description for the palette
BusConstant.img = "busconstant.png";       ///< Image to use for the palette
BusConstant.description = '<h2>Bus Constant Value</h2><p>A Bus Constant is' +
    ' a value that can be set in the circuit as a fixed value feeding a bus.</p>' +
    '<p>Values can be preceeded by 0x or 0b for hexadecimal or binary ' +
    'values.</p>' +
    '<p>The display and input format is selectable. Auto format will display values ' +
    'with eight or fewer digits as binary and larger values in hex.</p>';
BusConstant.order = 301;


/**
 * Clone this component object.
 * @returns {BusConstant}
 */
BusConstant.prototype.clone = function() {
    var copy = new BusConstant();
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
BusConstant.prototype.compute = function(state) {
    this.outs[0].set(this.value.get());
};

/**
 * Draw the component.
 * @param context Display context
 * @param view View object
 */
BusConstant.prototype.draw = function(context, view) {

    // Component background
    this.drawBox(context);
    context.fillStyle = "#dddddd";
    context.fill();


    // Select the style to draw the rest
    this.selectStyle(context, view);
    this.drawBox(context);

    this.value.draw(context,
        this.x,
        this.y,
        this.width - this.height / 2,
        this.naming);

    this.drawIO(context, view);
};


/**
 * Set the value for the input
 * @param value true for on
 */
BusConstant.prototype.set = function(value) {
    this.value.set(value);
    this.outs[0].set(this.value.get());
};

BusConstant.prototype.get = function() {
    return this.value.get();
};

BusConstant.prototype.setAsString = function(value, parseonly) {
    this.value.setAsString(value, parseonly);
    if (!parseonly) {
        this.outs[0].set(this.value.get());
    }
}

BusConstant.prototype.getAsString = function() {
    return this.value.getAsString();
};

/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusConstant.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    this.value.save(obj);
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
BusConstant.prototype.load = function(obj) {
    this.value.load(obj);
    Component.prototype.load.call(this, obj);
};

BusConstant.prototype.properties = function(main) {
    var that = this;

    var dlg = new ComponentPropertiesDlg(this, main);
    this.value.dialogOptions(dlg, true, function() {
        that.compute(null);
    });

    dlg.open();
};

