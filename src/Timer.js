import * as THREE from 'three';

export default class Timer {
	constructor() {
		this.clock = new THREE.Clock();

		this.tick = this.tick.bind(this);
		this.functionsToRunOnTick = [];

		this.oldTime = 0;
		this.newTime = 0;
		this.deltaTime = 0;

		this.tick();
	}

	tick() {
		this.newTime = this.clock.getElapsedTime();
		this.deltaTime = this.newTime - this.oldTime;
		this.oldTime = this.newTime;

		this.functionsToRunOnTick.forEach(func => func());

		window.requestAnimationFrame(this.tick);
	}

	runOnTick(func) {
		this.functionsToRunOnTick.push(func);
	}

	getTime() {
		return this.clock.getElapsedTime();
	}

	getDelta() {
		return this.deltaTime;
	}
}
