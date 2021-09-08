export default class Responsive {
	constructor(_events) {
		this.events = _events;
		this.canvas = document.querySelector('canvas.webgl');
		this.minAspectRatio = 1.75;
		this.phoneRatio = 0.85;

		this.size = 'normal';

		this.aspectRatio = this.canvas.offsetWidth / this.canvas.offsetHeight;
		this.aspectRatio = this.aspectRatio / this.minAspectRatio;

		this.responsiveFunction = () => {};

		this.handleResponsivness();

		this.events.on('resize', () => this.handleResponsivness());
	}

	handleResponsivness() {
		this.aspectRatio = this.canvas.offsetWidth / this.canvas.offsetHeight;
		this.aspectScaleFactor = this.aspectRatio / this.minAspectRatio;
		this.responsiveFunction();
	}

	addResponsiveFunction(func) {
		this.responsiveFunction = func;
		func();
	}
}
