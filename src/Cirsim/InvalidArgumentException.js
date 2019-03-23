/**
 * Exception for indicating an invalid argument.
 * @param message
 * @constructor
 */
export const InvalidArgumentException = function(message) {
	this.message = message;
	// Use V8's native method if available, otherwise fallback
	if ("captureStackTrace" in Error)
		Error.captureStackTrace(this, InvalidArgumentException);
	else
		this.stack = (new Error()).stack;
}

InvalidArgumentException.prototype = Object.create(Error.prototype);
InvalidArgumentException.prototype.name = "InvalidArgumentException";
InvalidArgumentException.prototype.constructor = InvalidArgumentException;
