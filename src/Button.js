import * as THREE from 'three';
import gsap from 'gsap/gsap-core';
import Responsive from './Responsive';

export default class Button extends Responsive {
	constructor(_options) {
		super(_options.events);
		this.scene = _options.scene;
		this.camera = _options.camera;
		this.loader = _options.loader;
		this.timer = _options.timer;
		this.threeScene = _options.threeScene;
		this.pos = _options.pos;

		this.mouse = new THREE.Vector2();

		this.load();
		this.initRaycaster();
		this.initResponsivness();
		this.initOnClick();

		this.animationDelay = 6;
	}

	load() {
		this.texture = this.loader.getTexture('btn');
		this.material = new THREE.MeshBasicMaterial({
			map: this.texture,
			transparent: true
		});
		this.material.toneMapped = false;
		this.material.depthWrite = false;

		this.mesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(1.5, 0.55),
			this.material
		);
		this.mesh.position.copy(this.pos);

		this.camera.container.add(this.mesh);
		this.scene.add(this.camera.container);
	}

	initRaycaster() {
		this.hovered = false;
		this.animatedParams = {
			color: 'rgb(250, 250, 250)'
		};

		this.raycaster = new THREE.Raycaster();

		this.events.on('mousemove', e => this.calculateMousePos(e));

		this.timer.runOnTick(() => {
			this.raycaster.setFromCamera(this.mouse, this.camera.container);

			const intersects = this.raycaster.intersectObject(this.mesh);

			if (intersects.length === 0 && this.hovered)
				this.lightenOnHoverOut();

			if (intersects.length !== 0 && !this.hovered) this.darkenOnHover();
		});
	}

	calculateMousePos(e) {
		this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	}

	lightenOnHoverOut() {
		this.hovered = false;
		gsap.to(this.animatedParams, {
			color: 'rgba(250, 250, 250)',
			duration: 0.3,
			onUpdate: () => {
				this.mesh.material.color = new THREE.Color(
					this.animatedParams.color
				);
			}
		});
		document.querySelector('body').classList.remove('pointer');
	}

	darkenOnHover() {
		this.hovered = true;
		gsap.to(this.animatedParams, {
			color: 'rgba(180, 180, 180)',
			duration: 0.3,
			onUpdate: () => {
				this.mesh.material.color = new THREE.Color(
					this.animatedParams.color
				);
			}
		});

		document.querySelector('body').classList.add('pointer');
	}

	initOnClick() {
		this.events.on('click', () => {
			if (!this.hovered) return;

			this.threeScene.playRedirectAnimationAndRedirect(2);
			this.playFadeAnimation();
		});
	}

	initResponsivness() {
		this.addResponsiveFunction(() =>
			this.transformAccordingToAspectRatio()
		);

		this.playFadeAnimation();
	}

	transformAccordingToAspectRatio() {
		this.mesh.visible = true;

		if (this.aspectRatio > this.minAspectRatio) {
			this.mesh.position.copy(this.pos);
			return this.mesh.scale.set(1, 1, 1);
		}

		if (this.aspectRatio < this.phoneRatio) this.mesh.visible = false;

		this.mesh.scale.set(this.aspectScaleFactor, this.aspectScaleFactor, 1);

		this.mesh.position.y = this.pos.y + (1 - this.aspectScaleFactor) * 2;
		this.mesh.position.x = this.pos.x + (1 - this.aspectScaleFactor) * 4.5;
	}

	playFadeAnimation() {
		const currentScale = this.mesh.scale.clone();

		this.timeline = gsap.timeline();

		this.timeline.to(this.mesh.scale, {
			duration: 0.5,
			x: 0,
			y: 0,
			ease: 'power1.inOut'
		});
		this.timeline.to(this.mesh.scale, {
			duration: 0.5,
			delay: 3.5,
			x: currentScale.x,
			y: currentScale.y,
			ease: 'power1.inOut'
		});
	}
}
