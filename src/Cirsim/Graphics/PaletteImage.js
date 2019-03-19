/**
 * Object for drawing an image that appears in the palette.
 *
 * Creates the canvas element that is used to draw the image
 *
 * jQuery free...
 *
 * @constructor
 * @param width Width of the canvas in pixels
 * @param height Height of the canvas in pixels
 */
export const PaletteImage = function(width, height) {
    this.width = width;
    this.height = height;
    this.scale = width / 60;

    const canvasHeight = height / this.scale;

    this.element = document.createElement('canvas');
    this.element.style.width = '60px';
    this.element.style.height = canvasHeight + 'px';
    this.element.style.backgroundColor = 'transparent';

    this.canvas = this.element;
    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.context = this.canvas.getContext("2d");
    this.context.lineWidth = this.scale;
}

/**
 * Draw a box.
 * @param wid Box width
 * @param hit Box height
 */
PaletteImage.prototype.box = function(wid, hit) {
    const x = this.width/2;
    const y = this.height/2;

    const leftX = x - wid/2 - 0.5;
    const rightX = x + wid/2 + 0.5;
    const topY = y - hit/2 - 0.5;
    const botY = y + hit/2 + 0.5;

    this.context.beginPath();
    this.context.moveTo(leftX, topY);
    this.context.lineTo(rightX, topY);
    this.context.lineTo(rightX, botY);
    this.context.lineTo(leftX, botY);
    this.context.lineTo(leftX, topY);

    this.fillStroke();
}

/**
 * Draw a circle
 * @param x Center of circle
 * @param y Center of circle
 * @param radius Circle radius
 */
PaletteImage.prototype.circle = function(x, y, radius) {
    x += this.width/2;
    y += this.height/2;

    let save = this.context.fillStyle;
    this.context.fillStyle = '#ffffff';
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2*Math.PI);
    this.context.fill();
    this.context.fillStyle = save;

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2*Math.PI);
    this.context.stroke();
}

/**
 * Draw an I/O pin for a component
 * @param x X location of pin relative to center of image
 * @param y Y location of pin relative to center of image
 * @param dir Direction of pin 'n', 'e', 's', 'w'
 * @param cnt (optional) Number of pins to draw
 * @param dy (optional) Delta Y between pins
 */
PaletteImage.prototype.io = function(x, y, dir, cnt, dy) {
    cnt = cnt !== undefined ? cnt : 1;
    dy = dy !== undefined ? dy : 1;

    x += this.width/2;
    y += this.height/2;

    for(let i=0; i<cnt; i++) {
        this.context.beginPath();
        this.context.moveTo(x, y);

        const len = 6 * this.scale;
        switch(dir) {
            case 'w':
            case 'W':
                this.context.lineTo(x - len, y);
                break;

            case 'e':
            case 'E':
                this.context.lineTo(x + len, y);
                break;

            case 'n':
            case 'N':
                this.context.lineTo(x, y - len);
                break;

            case 's':
            case 'S':
                this.context.lineTo(x, y + len);
                break;
        }

        this.context.stroke();

        y += dy;
    }
}

PaletteImage.prototype.clock = function(x, y, dir) {
    this.io(x, y, dir);
    this.context.beginPath();

    const wid = 3;

    x += this.width/2;
    y += this.height/2;

    switch(dir) {
        case 'n':
        case 'N':
            this.context.moveTo(x - wid, y);
            this.context.lineTo(x, y + wid);
            this.context.lineTo(x + wid, y);
            break;
    }

    this.context.stroke();
}

/**
 * Draw text on the palette image.
 * @param text Text to draw
 * @param x Location relative to center of the image
 * @param y Location relative to center of the image
 * @param font Font to use
 */
PaletteImage.prototype.drawText = function (text, x, y, font) {
    const context = this.context;
    context.beginPath();
    context.font = font !== undefined ? font : "14px Times";
    context.textAlign = "center";
    context.fillText(text, x+this.width/2, y+this.height/2);
    context.stroke();
}

PaletteImage.prototype.drawTextBar = function (text, x, y, font) {
	const context = this.context;

	const lw = context.lineWidth;
    this.drawText(text, x, y, font);

    context.lineWidth = 1;
    const wid = context.measureText(text);

	context.beginPath();
	y += this.height/2 - 16;
	context.moveTo(x+this.width/2-wid.width/2, y);
	context.lineTo(x+this.width/2+wid.width/2, y);
	context.stroke();

	context.lineWidth = lw;
}

/**
 * Fill a path and then stroke it.
 * @param fillStyle Optional fill style to use. Uses white if not supplied.
 */
PaletteImage.prototype.fillStroke = function(fillStyle) {
    if(fillStyle === undefined) {
        fillStyle = 'white';
    }

	const fs = this.context.fillStyle;
	this.context.fillStyle = fillStyle;
	this.context.fill();
	this.context.fillStyle = fs;
	this.context.stroke();
}

/**
 * Set the line width.
 * @param w New width to set
 * @returns {number} Current line width
 */
PaletteImage.prototype.lineWidth = function(w) {
    const lw = this.context.lineWidth;
    this.context.lineWidth = w;
    return lw;
}