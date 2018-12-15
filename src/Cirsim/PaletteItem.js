import {PaletteImage} from './Graphics/PaletteImage';
import {Tools} from './DOM/Tools';

/**
 * Items that appear in the palette
 *
 * jQuery free
 *
 * @param palette The Palette that owns this item
 * @param obj The Component object
 * @param circuit The Circuit
 * @constructor
 */
export const PaletteItem = function(palette, obj, circuit) {
    this.palette = palette;
    this.obj = obj;

    // Create an image component DOM element (canvas or img)
    const image = this.paletteImage(obj);

    const element = Tools.createClassedDiv('item');
    const box = Tools.createClassedDiv('box');
    element.appendChild(box);

    const img = Tools.createClassedDiv('img');
    box.appendChild(img);
    img.appendChild(image);

    const desc = Tools.createClassedDiv('desc');
    if(obj.label.length > 7) {
        Tools.addClass(desc, 'long');
    }
    desc.innerText = obj.label;
    box.appendChild(desc);

	this.element = element;
	palette.main.dragAndDrop.draggable(this);
};

/**
 * Create the image for the palette, either using an existing
 * image file or creating one using PaletteImage.
 * @returns DOM element for either canvas or img
 */
PaletteItem.prototype.paletteImage = function() {
    const obj = this.obj;

    if(obj.img !== null && obj.img !== undefined) {
        let root = this.palette.cirsim.root;

        const element = document.createElement('img');
        element.setAttribute('src', root + '/img/' + obj.img);
        element.setAttribute('alt', obj.desc);
        element.setAttribute('title', obj.desc);
	    element.setAttribute('draggable', 'false');

        return element;

    } else if(obj.paletteImage !== undefined) {
        return obj.paletteImage().element;
    } else {
        let pi = new PaletteImage(60, 60);

        pi.box(30, 40);
        pi.io(15, 20, 'w', 2, 20);
        pi.io(45, 20, 'e', 2, 20);
        pi.drawText(obj.label, 0, 0, "6px Times");
        return pi.element;
    }
}
