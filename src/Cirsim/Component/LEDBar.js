import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Led} from '../Graphics/Led';
import {Sanitize} from '../Utility/Sanitize';

/**
 * Component: LED Bar - 2 to 16 LED's in a vertical bar

 * @constructor
 */
export const LEDBar = function() {
    Component.call(this);

    this.height = 50;
    this.width = 20;
    this.leds = [];
    this.horz = false;      // Horizontal option
    this.bus = false;       // Bus input?

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
sixteen LEDs in a vertical or horizontal bar that are lighted by values on discrete inputs
or a single bus input. </p>`;
LEDBar.order = 502;
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
    if(this.bus) {
	    this.lastState = state[0];

	    if(this.lastState === undefined) {
		    this.lastState = [];
	    }
    } else {
	    this.lastState = state;
    }

};

/**
 * Clone this component object.
 * @returns {LEDBar}
 */
LEDBar.prototype.clone = function() {
    const copy = new LEDBar();
    copy.size = this.size;
    copy.horz = this.horz;
    copy.bus = this.bus;
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
    if(obj["horz"] !== undefined) {
        this.horz = obj['horz'] === true;
    }
    if(obj['bus'] !== undefined) {
        this.bus = obj['bus'] === true;
    }
	this.setSize(obj["size"]);
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
LEDBar.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    obj.size = this.size;
    obj.color = this.color;
    obj.horz = this.horz;
    obj.bus = this.bus;
    return obj;
};

/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
LEDBar.prototype.ensureIO = function() {
    let spacing = 16;

    // Input counter
    let i = 0;
	this.leds = [];

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

    if(this.horz) {
        //
        // Horizontal configuration
        //
	    this.width = this.size * spacing;
	    if(this.width < 50) {
		    this.width = 50;
	    }
	    this.height = 20;

	    let startX = this.size / 2 * spacing - 8;

	    for(i=0; i<this.size; i++) {
		    let pinX = startX - i * spacing;
		    this.leds.push(new Led(pinX, 0, spacing, this.height));
	    }

	    if(!this.bus) {
		    for(i=0; i<this.size; i++) {
			    let pinX = startX - i * spacing;
			    let pinLen = 24 - this.height/2;

			    let inp = null;
			    if(i < this.ins.length) {
				    inp = this.ins[i];
			    } else {
				    // Add any new pins
				    inp = this.addIn(pinX, this.height / 2, pinLen);
			    }

			    if(inp !== null) {
			    	inp.x = pinX;
			    	inp.y = this.height / 2;
			    	inp.len = pinLen;
				    inp.orientation = 's';
				    inp.bus = false;
			    }
		    }
        } else {
		    let inp = null;
		    if(i < this.ins.length) {
			    inp = this.ins[i];

			    inp.x = -this.width / 2;
			    inp.y = 0;
			    inp.len = 16;
		    } else {
			    // Add any new pins
			    inp = this.addIn(-this.width / 2, 0, 16);
		    }

		    inp.orientation = 'w';
		    inp.bus = true;
		    inp.autoLen();
	    }

    } else {
        //
        // Vertical configuration
        //
	    this.height = this.size * spacing;
	    if(this.height < 50) {
		    this.height = 50;
	    }
	    this.width = 20;

	    let startY = this.size / 2 * spacing - 8;

	    for(i=0; i<this.size; i++) {
		    let pinY = startY - i * spacing;
		    this.leds.push(new Led(0, pinY, this.width, spacing));
        }

	    if(!this.bus) {
		    for(i=0; i<this.size; i++) {
			    let pinY = startY - i * spacing;
			    let pinLen = 24 - this.width/2;

			    let inp = null;
			    if(i < this.ins.length) {
				    inp = this.ins[i];

				    inp.x = -this.width / 2;
				    inp.y = pinY;
				    inp.len = pinLen;
			    } else {
				    // Add any new pins
				    inp = this.addIn(-this.width / 2, pinY, pinLen);
			    }

			    if(inp !== null) {
				    inp.orientation = 'w';
				    inp.bus = false;
			    }
		    }
        } else {
		    let inp = null;
		    if(i < this.ins.length) {
			    inp = this.ins[i];

			    inp.x = 0;
			    inp.y = this.height / 2;
			    inp.len = 16;
		    } else {
			    // Add any new pins
			    inp = this.addIn(0, this.height / 2, 16);
		    }

            inp.orientation = 's';
            inp.bus = true;
            inp.autoLen();
        }

    }

    if(!this.bus) {
	    // Delete pins that have ceased to exist
	    if(i < this.ins.length) {
		    for( ; i<this.ins.length; i++) {
			    this.ins[i].clear();
		    }

		    this.ins.splice(this.size);
	    }
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

    let background = '#444444';

    this.selectStyle(context, view);

    this.drawBox(context, background);

    for(let i=0; i<this.size;  i++) {
        this.leds[i].draw(context, this.x, this.y, background);
    }

    this.drawBox(context, 'none');
    this.drawIO(context, view);
};

LEDBar.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);

    // Size
    const sizeId = dlg.uniqueId();
    let html = `<div class="control1 center"><label for="${sizeId}">Size: </label>
<input class="number" type="text" name="${sizeId}" id="${sizeId}" value="${this.size}"></div>`;

    // Color
    const colorId = dlg.uniqueId();
    html += Led.colorSelector(colorId, this.color);

    html += '<div class="control center"><div class="choosers">';

	const horzId = dlg.uniqueId();
    html += `
<label><input type="radio" name="${horzId}" ${!this.horz ? 'checked' : ''} value="0"> Vertical</label>
<label><input type="radio" name="${horzId}"  ${this.horz ? 'checked' : ''} value="1"> Horizontal</label>`;

    html += '<br>';

    const busId = dlg.uniqueId();
	html += `
<label><input type="radio" name="${busId}"  ${this.bus ? 'checked' : ''} value="1"> Bus Input</label>
<label><input type="radio" name="${busId}" ${!this.bus ? 'checked' : ''} value="0"> Single Bit Inputs</label>`;

	html += '</div></div>';

	dlg.extra(html, () => {
        const size = parseInt(document.getElementById(sizeId).value);
        if(isNaN(size) || size < 2 || size > 16) {
            return "Size must be an integer from 2 to 16";
        }
        return null;
    }, () => {
        this.color = Sanitize.sanitize(document.getElementById(colorId).value);
		this.horz = document.querySelector(`input[name=${horzId}]:checked`).value === '1';
		this.bus = document.querySelector(`input[name=${busId}]:checked`).value === '1';
        this.setSize(parseInt(document.getElementById(sizeId).value));
	});

    dlg.open();
};
