export default class Events {
	constructor() {
		this.funcsOnResize = [];
		this.funcsOnClick = [];
		this.funcsOnMouseMove = [];
		this.funcsOnDeviceOrientationChange = [() => console.log(123)];

		window.onresize = e => this.funcsOnResize.forEach(func => func(e));
		window.onclick = e => this.funcsOnClick.forEach(func => func(e));
		window.onmousemove = e =>
			this.funcsOnMouseMove.forEach(func => func(e));
		window.ondeviceorientation = e =>
			this.funcsOnDeviceOrientationChange.forEach(func => func(e));
	}

	initRedirectEvents(redirectFunction) {
		const links = document.querySelectorAll('.link');

		links.forEach((link, index) => {
			link.onclick = () => redirectFunction(index);
		});
	}

	on(eventType, func) {
		switch (eventType) {
			case 'resize':
				this.funcsOnResize.push(func);
				break;
			case 'click':
				this.funcsOnClick.push(func);
				break;
			case 'mousemove':
				this.funcsOnMouseMove.push(func);
				break;
		}
	}
}
