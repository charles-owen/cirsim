/**
 * Component: Text (labelling) gate
 */

import Component from '../Component.js';
import ComponentPropertiesDlg from '../Dlg/ComponentPropertiesDlg.js';
import Sanitize from '../Utility/Sanitize.js';
import CanvasHelper from '../Graphics/CanvasHelper.js';

let Text = function(name) {
    Component.call(this, name);

    this.height = 16;
    this.width = 32;

    this.text = "Text";
    this.size = 22;
    this.color = 'black';
};

Text.prototype = Object.create(Component.prototype);
Text.prototype.constructor = Text;

Text.prototype.prefix = null;

Text.type = "Text";        ///< Name to use in files
Text.label = "Text";          ///< Label for the palette
Text.desc = "Arbitrary Text";    ///< Description for the palette
Text.img = "text.png";       ///< Image to use for the palette
Text.order = 45;             ///< Order of presentation in the palette
Text.description = `<h2>Text</h2><p>Arbitrary text for diagrams. Allows for notations that help
describe parts of diagrams. The text size in pixels can be specified, as can the colors from a 
limited palette.</p><p>The color selection is overridden by the selection color (red) when the 
text component is selected.</p>`;
Text.help = 'text';

/**
 * Clone this component object.
 * @returns {Text}
 */
Text.prototype.clone = function() {
    var copy = new Text();
    copy.copyFrom(this);
    copy.text = this.text;
    copy.size = this.size;
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Text.prototype.draw = function(context, view) {
    // Select the style to draw
    let selected = this.selectStyle(context, view);

    let text = this.text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&amp;/g, '&');

    // Name
    context.font = this.size + "px Times";
    context.textAlign = "center";


    if(!selected) {
        // We only switch the color if the text is not
        // currently selectd.
        let color;
        switch(this.color) {
            default:
                color = this.color;
                break;

            case 'green':
                color = '#008000';
                break;

            case 'pink':
                color = '#FF69B4';
                break;

        }
        CanvasHelper.fillTextWith(context, text, this.x-1, this.y + 5, color);
    } else {
        context.fillText(text, this.x-1, this.y + 5);
    }

    this.drawIO(context, view);
};

Text.prototype.properties = function(main) {
    let dlg = new ComponentPropertiesDlg(this, main);
    var idText = dlg.uniqueId();
    var selText = '#' + idText;
    var idSize = dlg.uniqueId();
    var selSize = '#' + idSize;
    let idColor = dlg.uniqueId();
    let selColor = '#' + idColor;


    let html =`<div class="control">
<label for="${idText}">Text: </label>
<input type="text" id="${idText}" value="${this.text}">
</div>
<div class="control1 center"><label for="${idSize}">Size: </label>
<input class="number" type="text" id="${idSize}" value="${this.size}"></div>`;

    html += '<div class="control1 center"><label for="' + idColor + '">Color: </label><select id="' + idColor + '">';

    let colors = ['black', 'green', 'blue', 'purple', 'orange', 'maroon', 'pink'];
    for(const i in colors) {
        const color = colors[i];
        if(color === this.color) {
            html += '<option selected>' + color + '</option>';
        } else {
            html += '<option>' + color + '</option>';
        }
    }

    html += '</select></div>';

    dlg.extra(html, function() {
        var size = parseInt($(selSize).val());
        if(isNaN(size) || size < 10 || size > 55) {
            return "Size must be an integer between 10 and 55";
        }

        //
        // Convert all HTML entities so we can't possibly
        // have executable code here.
        //
        let text = Sanitize.htmlentities($(selText).val());
        if(text.length < 1) {
            return "Text cannot be empty";
        }

        return null;
    }, () => {
        this.text = Sanitize.htmlentities($(selText).val());
        this.size = parseInt($(selSize).val());
        this.color = Sanitize.sanitize($(selColor).val());
    });

    dlg.open();
    $(selText).select();
};


/**
 * Create a save object suitable for conversion to JSON for export.
 *
 * The character ' is replaced with `. This is so the
 * output JSON won't have any ' characters that would
 * cause problems in PHP and Javascript
 *
 * @returns {*}
 */
Text.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.text = this.text.replace(/'/g, '`');
    obj.size = this.size;
    if(this.color !== 'black') {
        obj.color = this.color;
    }
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Text.prototype.load = function(obj) {
    this.text = Sanitize.sanitize(obj["text"].replace(/`/g, "'"));
    this.size = +obj["size"];
    if(obj.color !== undefined) {
        this.color = Sanitize.sanitize(obj.color);
    }

    Component.prototype.load.call(this, obj);
};

export default Text;
