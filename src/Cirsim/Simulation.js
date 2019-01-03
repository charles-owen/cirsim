import buckets from 'buckets-js';

/**
 * Simulation management object
 * @constructor
 */
export const Simulation = function() {

    // Current animation time in seconds, we start at time 1 to avoid 0 issues
    this.time = 1;
    this.view = null;
    this.speed = 0.000001;      ///< Animation speed (1 million'th of real time)

    //
    // If the same component request multiple times during
    // the same time, this ensures the identical time events
    // will occur in the order they arrived.
    //
    this.order = 1;             ///< Extra sorting order to ensure stable sort

    this.priorityQueue = new buckets.PriorityQueue(function(a, b) {
        if(a.time === b.time) {
            return b.order - a.order;
        }

        return b.time - a.time;
    });

    /**
     * Set the simulation view. If set, we create a timing loop for
     * the simulation.
     * @param view
     */
    this.setView = function(view) {
        this.view = view;
        if(this.view !== null && !pendingAnimationFrame) {
            pendingAnimationFrame = true;
            requestAnimationFrame(mainloop);
        }
    };

    //
    // Animation main loop
    //
    var pendingAnimationFrame = false;
    var lastAnimationFrameTime = null;

    const mainloop = (time) => {
        pendingAnimationFrame = false;
        if(lastAnimationFrameTime === null) {
            lastAnimationFrameTime = time;
        }

        var delta = (time - lastAnimationFrameTime) * 0.001;
        lastAnimationFrameTime = time;

        // If the system is idle or very slow, there may be
        // a long time between calls, which can lock the
        // program up catching up on a day of updating. This
        // test ensures that we don't allow more than a one second
        // processing, so long delays are truncated.
        if(delta > 1) {
            delta = 1;
        }

        while(delta > 0) {
            /*
             * This ensures we have no time step greater than
             * 30ms;
             */
            var useDelta = delta;
            if(useDelta > 0.03) {
                useDelta = 0.03;
            }

            if(this.advance(useDelta * this.speed)) {
                if(this.view !== null) {
	                this.view.draw();
                }
            }

            delta -= useDelta;
        }

        if(this.view !== null) {
            pendingAnimationFrame = true;
            requestAnimationFrame(mainloop);
        }
    }

};

/**
 * Add an event to the simulation queue
 * @param component Component the event is for
 * @param delay Delay time until event happens (in ns)
 * @param state Array of input state
 */
Simulation.prototype.queue = function(component, delay, state) {
    var ns = delay * 0.000000001;
    this.priorityQueue.add({time: this.time + ns, order: this.order, component: component, state: state});
    this.order++;
};

/**
 * Advance the simulation in time
 * @param delta Amount of time to advance (seconds)
 */
Simulation.prototype.advance = function(delta) {
    var any = false;
    while(!this.priorityQueue.isEmpty() &&
            this.priorityQueue.peek().time <= this.time + delta) {
        var event = this.priorityQueue.dequeue();
        var advDelta = event.time - this.time;      // How much do we move time?
        delta -= advDelta;              // Subtract out the delta change

        this.time = event.time;
        if(advDelta > 0 && this.view !== null) {
            if(this.view.advance(advDelta)) {
                any = true;
            }
        }

        event.component.compute(event.state);
        any = true;
    }

    this.time += delta;
    if(delta > 0 && this.view !== null) {
        if(this.view.advance(delta)) {
            any = true;
        }
    }

    return any;
};
