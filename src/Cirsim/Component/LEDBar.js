/**
 * Component: LED Bar - 2 to 16 LED's in a vertical bar
 */
import Component from '../Component.js';
import ComponentPropertiesDlg from '../Dlg/ComponentPropertiesDlg.js';
import Led from '../Graphics/Led.js';
import Sanitize from '../Utility/Sanitize.js';

var LEDBar = function(name) {
    Component.call(this, name);

    this.height = 50;
    this.width = 20;
    this.leds = [];

    this.color = "blue";
    this.lastState = [];

    this.setSize(4);
};

LEDBar.prototype = Object.create(Component.prototype);
LEDBar.prototype.constructor = LEDBar;
LEDBar.prototype.prefix = "L";

LEDBar.type = "LEDBar";            ///< Name to use in files
LEDBar.label = "LED Bar";           ///< Label for the palette
LEDBar.desc = "LED Indicator Bar";       ///< Description for the palette
LEDBar.img = "ledbar.png";         ///< Image to use for the palette
LEDBar.description = `<h2>LED Bar</h2><p>The LED Bar component displays from two to 
sixteen LEDs in a vertical bar that are lighted by values on discrete inputs. </p>`;
LEDBar.order = 110;
LEDBar.help = 'ledbar';

LEDBar.prototype.setSize = function(size) {
    this.size = +size;
    this.ensureIO();
}

/**
 * Compute the gate result
 * @param state
 */
LEDBar.prototype.compute = function(state) {
    this.lastState = state;
};

/**
 * Clone this component object.
 * @returns {LEDBar}
 */
LEDBar.prototype.clone = function() {
    var copy = new LEDBar();
    copy.size = this.size;
    copy.ensureIO();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
LEDBar.prototype.load = function(obj) {
    this.color = Sanitize.sanitize(obj["color"]);
    this.setSize(obj["size"]);
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
LEDBar.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    obj.color = this.color;
    return obj;
};

/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
LEDBar.prototype.ensureIO = function() {
    let spacing = 16;

    this.height = this.size * spacing;
    if(this.height < 50) {
        this.height = 50;
    }

    let startY = this.size / 2 * spacing - 8;
    let pinLen = 24 - this.width/2;

    let i=0;
    this.leds = [];

    for( ; i<this.size; i++) {
        let pinY = startY - i * spacing;
        this.leds.push(new Led(0, pinY, this.width, spacing));

        if(i < this.ins.length) {
            this.ins[i].x = -this.width / 2;
            this.ins[i].y = pinY;
            this.ins[i].len = pinLen;
        } else {
            // Add any new pins
            this.addIn(-this.width / 2, pinY, pinLen);
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



/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
LEDBar.prototype.draw = function(context, view) {
    //
    // Ensure the state is current
    //
    let i=0;
    for( ; i<this.lastState.length && i<this.leds.length;  i++) {
        let led = this.lastState[i];
        this.leds[i].color = led === undefined ? 'undefined' : (led ? this.color : 'black');
    }

    for( ; i<this.leds.length;  i++) {
        this.leds[i].color = 'undefined';
    }

    let spacing = 16;
    let background = '#444444';

    this.selectStyle(context, view);

    this.drawBox(context, background);

    for(let i=0; i<this.size;  i++) {
        this.leds[i].draw(context, this.x, this.y, background);
    }

    this.drawBox(context, 'none');


    //this.drawName(context, -2, 5);
    this.drawIO(context, view);
};

LEDBar.prototype.properties = function(main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    var sizeId = dlg.uniqueId();
    var sizeSel = '#' + sizeId;
    let html = `<div class="control1 center"><label for="${sizeId}">Size: </label>
<input class="number" type="text" name="${sizeId}" id="${sizeId}" value="${this.size}"></div>`;

    var colorId = dlg.uniqueId();
    html += Led.colorSelector(colorId, this.color);

    dlg.extra(html, () => {
        var size = parseInt($(sizeSel).val());
        if(isNaN(size) || size < 2 || size > 16) {
            return "Size must be an integer from 2 to 16";
        }
        return null;
    }, () => {
        this.color = Sanitize.sanitize($('#' + colorId).val());
        this.setSize(parseInt($(sizeSel).val()));
    });

    dlg.open();
};

export default LEDBar;
