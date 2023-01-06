const INTERVAL = 400;
const RESTART_INTERVAL = 15000;

export class MouseEventSimulator {
    constructor() {
        this.lastMousePosition = {x: 0, y: 0};
    }

    simulateMovement() {
        // Calculate a random offset for the mouse position
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;

        // Update the mouse position by adding the offset
        this.lastMousePosition.x += offsetX;
        this.lastMousePosition.y += offsetY;

        // Use the updated mouse position to dispatch a mousemove event
        const event = new MouseEvent('mousemove', {
            clientX: this.lastMousePosition.x,
            clientY: this.lastMousePosition.y
        });
        window.dispatchEvent(event);
    }

    simulateScroll() {
        // Calculate a random factor to vary the amount of scroll
        const scrollFactor = Math.random() * 10;

        // Dispatch a wheel event with the calculated scroll amount
        const event = new WheelEvent('wheel', {
            deltaY: scrollFactor
        });
        window.dispatchEvent(event);
    }

    randomize() {
        setTimeout(() => {
            this.start();

            // Set a timeout to stop the mouse event simulation after a random interval
            setTimeout(() => {
                this.stop();
                this.randomize();
            }, RESTART_INTERVAL*Math.random());

        }, RESTART_INTERVAL*Math.random());
    }

    start() {
        // Set an interval to continuously simulate mouse movement and scroll events
        this.intervalId = setInterval(() => {
            this.simulateMovement();
            this.simulateScroll();
        }, INTERVAL);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}