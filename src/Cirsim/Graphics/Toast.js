import {Tools} from '../DOM/Tools';

/**
 * Toast notification system
 * jQuery-free
 * @param main Main object
 * @constructor
 */
export const Toast = function(main) {
	/** Default toast duration in milliseconds */
	this.defaultDuration = 2000;

	/** Inter-toast delay time in milliseconds */
	this.interToastDelay = 500;

    let messages = [];  // Pending messages
    let active = false; // Is there an active message displaying?

	let element = null;

	/**
	 * Create the toast div
	 * @param div Div to put the toast into
	 */
    this.create = (div) => {
		element = Tools.createClassedDiv('toast');
		div.appendChild(element);

		element.innerHTML = 'testing';
    }

    const show = () => {
    	if(messages.length > 0 && !active) {
		    // Set the message
		    let message = messages[0];
            messages.splice(0, 1);
            element.innerHTML = message.msg;

            // Show it
		    element.classList.add('toast-active');
		    active = true;

		    // Delay while active
		    setTimeout(() => {
		    	// Hide it
			    element.classList.remove('toast-active');

			    // Delay between toasts
			    setTimeout(() => {
			    	active = false;
			    	show();
			    }, this.interToastDelay)
		    }, message.time);
        }
    }

	/**
	 * Display a toast message
	 * @param msg Message to display
	 * @param time Time to display in milliseconds, omit for default
	 */
	this.message = function(msg, time) {
        if(time === undefined) {
            time = this.defaultDuration;
        }

        messages.push({msg: msg, time: time});
        show();
    }

	/**
	 * Display any JSON errors we have received.
	 * @param jsonApi JsonAPI object
	 * @returns {boolean} true if any errors existed.
	 */
	this.jsonErrors = function(jsonApi) {
        if(jsonApi.errors() !== null) {
            jsonApi.errors().forEach((error)=>{
                this.message('Server Error: ' + error.title, 5000);
            })

            return true;
        }

        return false;
    }
}


