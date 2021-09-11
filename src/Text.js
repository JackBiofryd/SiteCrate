import gsap from 'gsap/gsap-core';
import { Text as ThreeText } from 'troika-three-text';
import * as THREE from 'three';
import Responsive from './Responsive';

export default class Text extends Responsive {
	constructor(_options) {
		super(_options.events);
		this.scene = _options.scene;
		this.camera = _options.camera;
		this.loader = _options.loader;
		this.timer = _options.timer;

		this.position = new THREE.Vector3(_options.x, _options.y, _options.z);

		this.text = new THREE.Group();

		this.mainTextSize = 0.8;
		this.secondaryTextSize = 0.2;

		this.paragraphPosition = new THREE.Vector3(
			_options.paragraphX,
			_options.paragraphY,
			_options.paragraphZ
		);

		this.material = new THREE.MeshBasicMaterial({
			color: 0xffffff
		});
		this.material.toneMapped = false;
		this.material.depthWrite = false;

		this.animationDuration = 4;

		this.load();
		this.initResponsivness();
	}

	load() {
		this.primaryText = new ThreeText();
		this.primaryText.text = 'The new generation of\nwebsites is here.';
		this.primaryText.font = 'rubik-hollow.ttf';
		this.primaryText.anchorX = '50%';
		this.primaryText.anchorY = '50%';
		this.primaryText.position.copy(this.position);
		this.primaryText.fontSize = this.mainTextSize;
		this.primaryText.material = this.material;
		this.primaryText.sync();
		this.text.add(this.primaryText);

		this.secondaryText = new ThreeText();
		this.secondaryText.text = 'And trust us, you need to be a part of it.';
		this.secondaryText.font = 'rubik.ttf';
		this.secondaryText.anchorX = '50%';
		this.secondaryText.anchorY = '50%';
		this.secondaryText.position.copy(this.paragraphPosition);
		this.secondaryText.fontSize = this.secondaryTextSize;
		this.secondaryText.material = this.material;
		this.secondaryText.sync();
		this.text.add(this.secondaryText);

		this.camera.container.add(this.text);
	}

	initResponsivness() {
		this.addResponsiveFunction(() =>
			this.changeTextAccordingToAspectRatio()
		);
	}

	changeTextAccordingToAspectRatio() {
		if (!this.text) return;

		if (this.aspectRatio > this.phoneRatio) {
			this.primaryText.textAlign = 'left';
			this.primaryText.maxWidth = Infinity;
			this.secondaryText.textAlign = 'left';
			this.secondaryText.maxWidth = Infinity;

			this.primaryText.position.copy(this.position);
			this.secondaryText.position.copy(this.paragraphPosition);

			this.secondaryText.fontSize = this.secondaryTextSize;

			this.size = 'normal';
		}

		if (this.aspectRatio > this.minAspectRatio) {
			this.text.scale.set(1, 1, 1);
			return this.text.position.set(0, 0, 0);
		}

		if (this.size === 'normal') {
			this.text.position.y = (1 - this.aspectScaleFactor) * 0.6;
			this.text.scale.set(
				this.aspectScaleFactor,
				this.aspectScaleFactor,
				1
			);
		}

		if (this.aspectRatio < this.phoneRatio && this.size !== 'phoneSize') {
			this.size = 'phoneSize';

			this.text.position.y += 0.75;
			this.text.scale.set(0.5, 0.5, 1);

			this.primaryText.textAlign = 'center';
			this.primaryText.position.x = 0;
			this.primaryText.maxWidth = 5.5;
			this.primaryText.sync();

			this.secondaryText.fontSize *= 1.15;
			this.secondaryText.textAlign = 'center';
			this.secondaryText.position.x = 0;
			this.secondaryText.position.y -= 1.15;
			this.secondaryText.maxWidth = 4.5;
			this.secondaryText.sync();
		}
	}

	playFadeAnimation() {
		gsap.to(this.material, {
			duration: 0.5,
			opacity: 0,
			ease: 'power1.inOut'
		});
		gsap.to(this.material, {
			duration: 0.5,
			delay: this.animationDuration - 0.5,
			opacity: 1,
			ease: 'power1.inOut'
		});
	}
}
