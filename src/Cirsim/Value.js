
import Sanitize from './Utility/Sanitize';

/**
 * Support for values that can be passed around in Cirsim.
 *
 * Mainly used in support of devices that display bus values
 * in binary, hex, or floating point, but also can be used
 * for scalar value.
 *
 * Supports:
 *  single-bit
 *  binary
 *  hexadecimal
 *  16-bit Half-Float values.
 *  @param init Initial value
 *  @param type Value.AUTO, Value.BINARY, Value.HEX, or Value.FLOAT16
 *  @constructor
 */
export const Value = function(init, type) {
    // Default is undefined
    this.value = undefined;
    this.type = type !== undefined ? type : Value.AUTO;

    // Optional argument can be an array or value to set
    if(init !== undefined) {
        this.set(init);
    }
}

// The value types. This is how the type will display
Value.AUTO = 0;   ///< Binary or hex as appropriate
Value.BINARY = 1; ///< Always in binary
Value.HEX = 2;    ///< Hexadecimal
Value.FLOAT16 = 3;    ///< 16-bit Half Float

/**
 * Get the current value from a binary array of (true/false)
 * @returns {*}
 */
Value.prototype.get = function() {
    return this.value;
}

/**
 * Set the value of this float
 * @param val Binary array of value (true/false)
 */
Value.prototype.set = function(val) {
    if(val instanceof Value) {
        throw "Invalid";
    }
    if(Array.isArray(val)) {
        this.value = val.slice();
    } else {
        this.value = val;
    }
}

Value.prototype.setZero = function(size) {
    this.value = [];
    for(var i=0; i<size; i++) {
        this.value.push(false);
    }
}

Value.prototype.clone = function() {
    return new Value(this.value, this.type);
}

/**
 * Add values for this to the save object
 */
Value.prototype.save = function(obj) {
    obj.value = this.value;
    if(this.type !== Value.AUTO) {
        obj.valuetype = this.type;
    }
}

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Value.prototype.load = function(obj) {
    this.set(obj["value"]);
    if(obj['valuetype'] !== undefined) {
        this.type = obj['valuetype'];
    }
}

Value.prototype.getAsString = function() {
    if(this.value === undefined) {
        return "?";
    }

    switch(this.type) {
        default:
            if(this.value.length > 8) {
                return this.getAsHex();
            } else {
                return this.getAsBinary();
            }

        case Value.BINARY:
            return this.getAsBinary();

        case Value.HEX:
            return this.getAsHex();

        case Value.FLOAT16:
            return this.getAsFloat16();
    }
}


Value.prototype.setAsString = function(str, parseonly) {
    str = Sanitize.sanitize(str);

    if(!((typeof str === 'string' || str instanceof String))) {
        str = str.toString();
    }

    // Trim any leading or trailing space
    str = str.replace(/^\s+|\s+$/gm,'');
    str = str.toLowerCase();

    if(str.indexOf("inf") >= 0 || str === "nan") {
        return this.setAsFloat16(str, parseonly);
    }

    var prefix = str.substr(0, 2);
    if(prefix === '0x') {
        return this.setAsHex(str.substr(2), parseonly);
    }

    if(prefix === '0b') {
        return this.setAsBinary(str.substr(2), parseonly);
    }

    if(str.indexOf('.') >= 0 || str.indexOf('e') >= 0 || str.indexOf('-') >= 0) {
        return this.setAsFloat16(str, parseonly);
    }

    switch(this.type) {
        default:
            return this.setAsBinary(str, parseonly);

        case Value.BINARY:
            return this.setAsBinary(str, parseonly);

        case Value.HEX:
            return this.setAsHex(str, parseonly);

        case Value.FLOAT16:
            return this.setAsFloat16(str, parseonly);
    }
}

/**
 * Draw the bus value with optional label.
 * @param context Context to draw on
 * @param x Center X location to draw
 * @param y Center Y location to draw
 * @param width Maximum allowed width
 * @param label Label to draw. Undefined or null does not draw
 */
Value.prototype.draw = function(context, x, y, width, label) {
    context.save();
    context.translate(x, y);

    context.font = "14px Times";
    context.textAlign = "left";

    var wLabel = 0;

    if(label !== undefined && label !== null) {
        wLabel = context.measureText(label + ": ").width;
    }

    var value = this.getAsString();
    var wValue = context.measureText(value).width;
    var wAll = wLabel + wValue;     // Width of it all

    var scale = 1;
    if(wAll > width) {
        scale = width / wAll;
        context.scale(scale, scale);
    }

    var dy = 5;

    if(wLabel > 0) {
        context.fillText(label + ": ", -wAll/2, dy);
    }

    var hex = this.type == Value.HEX ||
        (this.type == Value.AUTO && Array.isArray(this.value) && this.value.length > 8);

    if(hex) {
        context.font = "bold 14px Times";
    }

    context.fillText(value, -wAll/2 + wLabel, dy);
    context.restore();
}

/**
 * Create content to support dialog box editing of the value
 * @param dlg Dialog box (derived from Dialog)
 * @param value True if dialog box includes the value.
 *
 * An Input dialog box would allow value editing, while an output
 * dialog box would not.
 *
 * @return Object with these attributes:
 *    html: HTML for the dialog box,
 *    validate: A validation function,
 *    accept: An acceptance function}
 */
Value.prototype.dialogContent = function(dlg, value) {
    let valueId = dlg.uniqueId();
    let selectId = dlg.uniqueId();

    let option = (html, name, type) => {
        return `<input type="radio" name="${selectId}" value="${type}"${(this.type === type ? " checked" : "")}> ${name}`;
    };

    let html = '';
    if(value) {
        let initial;
        switch(this.type) {
            default:
            case Value.BINARY:
                initial = '0b' + this.getAsBinary();
                break;

            case Value.HEX:
                initial = '0x' + this.getAsHex();
                break;

            case Value.FLOAT16:
                initial = this.getAsFloat16();
                break;
        }

        html += '<div class="control"><label for="' + valueId + '">Value</label>' +
            '<input type="text" id="' + valueId + '" name="' + valueId +
            '" value="' + initial + '" spellcheck="false" onfocus=" this.select()"></div>';
    }

    html += '<div class="control">' +
        option(html, "Auto", Value.AUTO) + '<br>' +
        option(html, "Hexadecimal", Value.HEX) + '<br>' +
        option(html, "Binary", Value.BINARY) + '<br>' +
        option(html, "Float-16", Value.FLOAT16) + '</div>';

    let validate = () => {
        // Validation function
        if(value) {
            // Save off the type so we can change it temporarily
            let saveType = this.type;
            this.type = parseInt(document.querySelector('input[name="' + selectId + '"]:checked').value); // $().val());

            // Test the input string
            let valstr = document.getElementById(valueId).value; //  $('#' + valueId).val();
            let val = this.setAsString(valstr, true);

            // Restore the type
            this.type = saveType;

            if(!val) {
                return "Invalid value";
            }
        }

        return null;
    };

    let accept = () => {
        // Accept function
        this.type = parseInt(document.querySelector('input[name="' + selectId + '"]:checked').value); // parseInt($('input[name="' + selectId + '"]:checked').val());
        if(value) {
	        let valstr = document.getElementById(valueId).value; //  $('#' + valueId).val();
            this.setAsString(valstr, false);
        }
    }

    return {html: html, validate: validate, accept: accept};
}

/**
 * Add dialog options to a dialog box for editing the value
 * @param dlg Dialog box (derived from Dialog)
 * @param value True if dialog box includes the value.
 *
 * An Input dialog box would allow value editing, while an output
 * dialog box would not.
 *
 * @param callback Function to call after the value has been set
 */
Value.prototype.dialogOptions = function(dlg, value, callback) {
    let content = this.dialogContent(dlg, value);

    dlg.extra(content.html, content.validate, () => {
        content.accept();

        if(callback !== undefined) {
            callback();
        }
    }, value ? 170 : 130);
}

/**********************************************************
 *
 * Integer
 *
 **********************************************************/

Value.prototype.getAsInteger = function() {
    if(!Array.isArray(this.value)) {
        return "?";
    }

    var result = 0;
    var pow = 1;

    for(var i=0;  i<this.value.length;  i++, pow*=2) {
        if(this.value[i] === undefined) {
            return '?';
        } else if(this.value[i]) {
            result += pow;
        }
    }

    return result;
}

/**
 * Set the value from an integer
 * @param v Value to set
 * @param size Number of bits
 */
Value.prototype.setAsInteger = function(v, size) {
    var value = [];
    for(let i=0; i<size; i++) {
        if(value.push((v & 1) === 1));
        v >>= 1;
    }

    this.value = value;
    return true;
}

/**********************************************************
 *
 * Hexadecimal
 *
 **********************************************************/

Value.prototype.getAsHex = function() {
    if(!Array.isArray(this.value)) {
        return "?";
    }

    var str = '';

    for(var i=0;  i<this.value.length;  i+=4) {
        var p = 1;
        var val = 0;
        for(var j=0;  j<4 && (i + j) < this.value.length;  j++, p*=2) {
            if(this.value[i+j] === undefined) {
                val = -1;
                break;
            }

            if(this.value[i+j]) {
                val += p;
            }
        }

        if(val < 0) {
            str = '?' + str;
        } else {
            str = Number(val).toString(16) + str;
        }
    }

    return str;
}

Value.prototype.setAsHex = function(str, parseonly) {
    var value = [];
    for(var i=str.length-1; i>=0; i--) {
        var c = str.substr(i, 1);
        if(c === ' ') {
            if(value.length > 0) {
                // End when we hit any trailing spaces
                break;
            } else {
                // Ignore leading spaces
                continue;
            }
        } else if(c === '?') {
            value.push([undefined, undefined, undefined, undefined]);
        } else {
            var h = parseInt(c, 16);
            if(isNaN(h)) {
                return false;
            }

            value.push(
                (h & 1) == 1,
                (h & 2) == 2,
                (h & 4) == 4,
                (h & 8) == 8
            );
        }
    }

    if(!parseonly) {
        this.value = value;
    }

    return true;
}

/**********************************************************
 *
 * Binary
 *
 **********************************************************/

/**
 * Get the value as a binary string
 * @returns binary string
 */
Value.prototype.getAsBinary = function() {
    function toValueString(v) {
        if(Array.isArray(v)) {
            var str = '';
            v.forEach(function(v1) {
                str = toValueString(v1) + str;
            })

            return str;
        } else {
            return v === undefined ? "?" : (v ? "1" : "0")
        }
    }

    return toValueString(this.value);
}

/**
 * Set the value from a binary string
 * @param str String to parse
 * @param parseonly True if parse, but don't set (error check)
 * @return true if successful
 */
Value.prototype.setAsBinary = function(str, parseonly) {
    var value = [];
    for(var i=str.length-1; i>=0;  i--) {
        var c = str.substr(i, 1);
        if(c === ' ') {
            if(value.length > 0) {
                // End when we hit any leading spaces
                break;
            } else {
                // Ignore trailing spaces
                continue;
            }
        }

        switch(c) {
            case '0':
                value.push(false);
                break;

            case '1':
                value.push(true);
                break;

            case '?':
                value.push(undefined);
                break;

            default:
                return false;
        }
    }

    if(!parseonly) {
        this.value = value;
    }

    return true;
}




/**********************************************************
 *
 * 16-bit Floating Point
 *
 **********************************************************/

Value.prototype.setInfinity16 = function(neg) {
    this.value = [false, false, false, false, false, false, false, false, false, false,
        true, true, true, true, true,
        neg];
}

/**
 * Get the value as a floating point string like 3.5 or -7.88
 * @returns {string}
 */
Value.prototype.getAsFloat16 = function() {
    if(this.value.length < 16) {
        return '?';
    }

    var str = this.value[15] ? '-' : '';

    for(var i=0; i<15; i++) {
        if(this.value[i]) {
            break;
        }
    }

    if(i >= 15) {
        return str + '0';
    }

    /*
     * Convert exponent part to integer
     */
    var p = 1;
    var e = 0;
    for(i=10;  i<15; i++, p*=2) {
        if(this.value[i]) {
            e += p;
        }
    }

    if(e == 0x1f) {
        for(var i=0; i<10; i++) {
            if(this.value[i]) {
                return "NaN";
            }
        }

        return str + "inf";
    }

    /*
     * Remove the offset
     */
    e -= 0xf;

    /*
     * Convert fractional part to float
     */
    var f = 1;
    var p = 0.5;
    for(i=9; i>=0; i--, p/=2) {
        if(this.value[i]) {
            f += p;
        }
    }

    f *= Math.pow(2, e);

    return str + f.toExponential(3);
}

Value.prototype.setAsFloat16 = function(str, parseonly) {
    var zero = [false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false,
        false];
    var value = zero;

    if(str === "inf") {
        if(!parseonly) {
            this.value = [false, false, false, false, false, false, false, false, false, false,
                true, true, true, true, true,
                false];
        }
        return true;
    }

    if(str === "-inf") {
        if(!parseonly) {
            this.value = [false, false, false, false, false, false, false, false, false, false,
                true, true, true, true, true,
                true];
        }
        return true;
    }

    if(str === "nan") {
        if(!parseonly) {
            this.value = [true, true, true, true, true, true, true, true, true, true,
                true, true, true, true, true,
                false];
        }
        return true;
    }

    var f = parseFloat(str);
    if(isNaN(f)) {
        return false;
    }

    if(f == 0) {
        if(!parseonly) {
            this.value = value;
        }
        return true;
    }

    var neg = f < 0;
    if(neg) {
        f = -f;
    }

    var e = 0;
    while(f > 1 && e < 16) {
        f /= 2;
        e++;
    }

    if(e >= 15) {
        // Infinity
        if(!parseonly) {
            this.setInfinity16(neg);
        }
        return true;
    }

    while(f < 1 && e > -15) {
        f *= 2;
        e--;
    }

    if(e <= -15) {
        // Not supporting denormal...
        if(!parseonly) {
            this.setZero(16);
        }
        return true;
    }

    f -= 1; // Remove the 1
    f *= 2;
    for(var i=9; i>=0; i--, f*=2) {
        if(f >= 1) {
            value[i] = true;
            f -= 1;
        } else {
            value[i] = false;
        }
    }

    e += 0xf;
    for(i=10; i<15; i++, e >>= 1) {
        if(e & 1) {
            value[i] = true;
        } else {
            value[i] = false;
        }
    }

    value[15] = neg;

    if(!parseonly) {
        this.value = value;
    }

    return true;
}

export default Value;


