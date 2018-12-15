/**
 * Convenience functions for working with a canvas.
 * @constructor
 */
export const CanvasHelper = function() {

}

CanvasHelper.roundedRect = function (context, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    context.beginPath();
    context.moveTo(x+r, y);
    context.arcTo(x+w, y,   x+w, y+h, r);
    context.arcTo(x+w, y+h, x,   y+h, r);
    context.arcTo(x,   y+h, x,   y,   r);
    context.arcTo(x,   y,   x+w, y,   r);
    context.closePath();
}

/**
 * Do a context.fill(), but with a temporary style.
 * @param context Context to fill
 * @param fillStyle Style to use. If omitted, draws in white.
 */
CanvasHelper.fillWith = function(context, fillStyle) {
    let save = context.fillStyle;
    context.fillStyle = fillStyle !== undefined ? fillStyle : "#ffffff";
    context.fill();
    context.fillStyle = save;
}

/**
 * Do a context.fillText(), but with a temporary style.
 * @param context Context to fill
 * @param text Text to put in
 * @param x X location
 * @param y Y location
 * @param fillStyle Style to use. If omitted, draws in white.
 */
CanvasHelper.fillTextWith = function(context, text, x, y, fillStyle) {
    let save = context.fillStyle;
    context.fillStyle = fillStyle !== undefined ? fillStyle : "#ffffff";
    context.fillText(text, x, y);
    context.fillStyle = save;
}

export default CanvasHelper;

