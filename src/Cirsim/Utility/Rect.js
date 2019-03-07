
/**
 * A simple rectangle representation
 * @param left Left. If undefined, uses zero.
 * @param top Top. If undefined, uses zero.
 * @param right Right side. If undefined, uses this.left
 * @param bottom Bottom side. If undefined, used this.top.
 * @constructor
 */
export const Rect = function(left=0, top=0, right=0, bottom=0) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
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
        let t = this.left; this.left = this.right; this.right = t;
    }

    if(this.top > this.bottom) {
        let t = this.top; this.top = this.bottom; this.bottom = t;
    }
};

Rect.prototype.isEmpty = function() {
    return this.left >= this.right || this.top >= this.bottom;
};

Rect.prototype.contains = function(x, y) {
    return x >= this.left && x <= this.right &&
            y >= this.top && y <= this.bottom;
};

/**
 * Expand this rect to include all of some other rect.
 * @param rect Other rect to include
 */
Rect.prototype.expand = function(rect) {
    if(rect.left < this.left) {
        this.left = rect.left;
    }

    if(rect.right > this.right) {
        this.right = rect.right;
    }

    if(rect.top < this.top) {
        this.top = rect.top;
    }
    
    if(rect.bottom > this.bottom) {
        this.bottom = rect.bottom;
    }
}

/**
 * Expand this rect to include a given point.
 * @param x
 * @param y
 */
Rect.prototype.expandXY = function(x, y) {
    if(x < this.left) {
        this.left = x;
    }

    if(x > this.right) {
        this.right = x;
    }

    if(y < this.top) {
        this.top = y;
    }

    if(y > this.bottom) {
        this.bottom = y;
    }
}
