import gsap from 'gsap/gsap-core';
import * as THREE from 'three';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Responsive from './Responsive';

export default class Camera extends Responsive {
	constructor(_options) {
		super(_options.events);
		this.timer = _options.timer;

		this.initialPosition = new THREE.Vector3(
			_options.x,
			_options.y,
			_options.z
		);
		this.lookingAt = new THREE.Vector3();
		this.movedPosition = this.initialPosition.clone();

		this.container = new THREE.PerspectiveCamera(
			35,
			this.canvas.offsetWidth / this.canvas.offsetHeight,
			0.1,
			1000
		);
		this.container.position.copy(this.initialPosition);

		this.enableCameraMovement = true;

		gsap.registerPlugin(MotionPathPlugin);
		this.animationDuration = 3;
		this.animationDelay = this.animationDuration / 2;

		this.initEvents();
		this.sizeFactor = 0;
		this.initResponsivness();
	}

	initEvents() {
		this.mouse = new THREE.Vector2();

		this.events.on('mousemove', e => {
			this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

			if (this.enableCameraMovement) this.moveCameraAccordingToMousePos();
		});
	}

	moveCameraAccordingToMousePos() {
		this.container.position.x =
			this.movedPosition.x + -this.mouse.x * 0.075;
		this.container.position.y = this.movedPosition.y + this.mouse.y * 0.075;
	}

	initResponsivness() {
		this.addResponsiveFunction(() =>
			this.moveCameraAccordingToAspectRatio()
		);
	}

	moveCameraAccordingToAspectRatio() {
		if (
			this.aspectRatio > this.minAspectRatio ||
			this.aspectRatio < this.phoneRatio
		) {
			this.container.position.x = this.initialPosition.x;
			return (this.movedPosition.x = this.initialPosition.x);
		}

		this.sizeFactor = (1 - this.aspectScaleFactor) * 1.25;

		this.container.position.x = this.initialPosition.x - this.sizeFactor;
		this.container.lookAt(
			this.lookingAt.x - this.sizeFactor,
			this.lookingAt.y,
			this.lookingAt.z
		);

		this.movedPosition.x = this.initialPosition.x - this.sizeFactor;
	}

	update() {
		this.container.aspect =
			this.canvas.offsetWidth / this.canvas.offsetHeight;
		this.container.updateProjectionMatrix();
	}

	lookAt(_x, _y, _z) {
		this.container.lookAt(_x, _y, _z);
		this.lookingAt.set(_x, _y, _z);
	}

	transitionTo(finalPosition, options) {
		console.log('transito');
		if (!this.enableCameraMovement) return;
		this.enableCameraMovement = false;

		this.createTransitionTimeline();
		this.addTransitionOfCameraPositionAndRotationToTimeline(
			finalPosition,
			options
		);

		if (options?.reverse) {
			this.container.lookAt(
				finalPosition.x,
				this.lookingAt.y,
				this.lookingAt.z
			);
			this.transitionTimeLine.reverse(0);
		} else {
			this.transitionTimeLine.play();
		}

		this.enableCameraMovementOnAnimationFinish();
	}

	createTransitionTimeline() {
		this.transitionTimeLine = gsap.timeline({
			paused: true
		});
		this.transitionTimeLine.add('start');
	}

	addTransitionOfCameraPositionAndRotationToTimeline(finalPosition, options) {
		const startPosition = this.container.position;

		this.transitionCameraPositionWithMotionPaths(
			[
				[{ x: startPosition.x }, { x: finalPosition.x }],
				[{ z: startPosition.z }, { z: finalPosition.z }],
				[{ y: startPosition.y + 1 }, { y: finalPosition.y }]
			],
			this.animationDelay
		);

		this.transitionCameraRotation(finalPosition, options);
	}

	transitionCameraPositionWithMotionPaths(transitions, delay) {
		transitions.forEach(transition => {
			this.transitionTimeLine.to(
				this.container.position,
				{
					duration: this.animationDuration,
					delay: delay,
					ease: 'power1.inOut',
					motionPath: {
						path: transition
					}
				},
				'start'
			);
		});
	}

	transitionCameraRotation(finalPosition, options) {
		this.turnCameraTowardCoordinate(finalPosition.x);
		this.animateCameraMovementAccordingToPositionChange();

		if (options?.zRotation) {
			this.animateZRotation(options.zRotation);
		}
	}

	turnCameraTowardCoordinate(x) {
		console.log(this.mouse.x);
		this.lookingAt.x = this.lookingAt.x - this.sizeFactor;

		this.transitionTimeLine.to(
			this.lookingAt,
			{
				duration: this.animationDelay,
				ease: 'power1.inOut',
				x,
				onUpdate: () => {
					this.container.lookAt(
						this.lookingAt.x,
						this.lookingAt.y,
						this.lookingAt.z
					);
				}
			},
			'start'
		);
	}

	animateCameraMovementAccordingToPositionChange() {
		const xRotation = this.container.rotation.x;
		this.transitionTimeLine.to(
			this.container.rotation,
			{
				duration: this.animationDuration,
				delay: this.animationDelay,
				ease: 'power1.inOut',
				motionPath: {
					curviness: 2,
					path: [
						{ x: xRotation },
						{ x: xRotation - 0.04 },
						{ x: xRotation + 0.7 }
					]
				}
			},
			'start'
		);
	}

	animateZRotation(zRotation) {
		this.transitionTimeLine.to(
			this.container.rotation,
			{
				duration: this.animationDuration,
				delay: this.animationDelay,
				ease: 'power1.inOut',
				z: this.container.rotation.z + zRotation
			},
			'start'
		);
	}

	enableCameraMovementOnAnimationFinish() {
		const fullAnimationTime =
			(this.animationDuration + this.animationDelay) * 1000;
		setTimeout(() => (this.enableCameraMovement = true), fullAnimationTime);
	}
}
