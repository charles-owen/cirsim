/**
 * Simple rectangle
 */


/**
 * Constructor
 * @param left Left. If undefined, uses zero.
 * @param top Top. If undefined, uses zero.
 * @param right Right side. If undefined, uses this.left
 * @param bottom Bottom side. If undefined, used this.top.
 * @constructor
 */
var Rect = function(left, top, right, bottom) {
    if(left !== undefined) {
        this.left = left;
    } else {
        this.left = 0;
    }

    if(top !== undefined) {
        this.top = top;
    } else {
        this.top = 0;
    }

    if(right !== undefined) {
        this.right = right;
    } else {
        this.right = this.left;
    }

    if(bottom !== undefined) {
        this.bottom = bottom;
    } else {
        this.bottom = this.top;
    }

};

Rect.prototype.setRightBottom = function(right, bottom) {
    this.right = right;
    this.bottom = bottom;
};

/**
 * Ensure left <= right and top <= bottom for the rectangle
 */
Rect.prototype.normalize = function() {
    if(this.left > this.right) {
        var t = this.left; this.left = this.right; this.right = t;
    }

    if(this.top > this.bottom) {
        t = this.top; this.top = this.bottom; this.bottom = t;
    }
};

Rect.prototype.isEmpty = function() {
    return this.left >= this.right || this.top >= this.bottom;
};

Rect.prototype.contains = function(x, y) {
    return x >= this.left && x <= this.right &&
            y >= this.top && y <= this.bottom;
};

export default Rect;
