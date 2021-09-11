import * as THREE from 'three';
import gsap from 'gsap/gsap-core';
import * as dat from 'dat.gui';
import Responsive from './Responsive';
import flagVertexShader from './shaders/flag/vertex.glsl';
import flagFragmentShader from './shaders/flag/fragment.glsl';

export default class ThreeScene extends Responsive {
	constructor(_options) {
		super(_options.events);
		this.loader = _options.loader;
		this.scene = _options.scene;
		this.camera = _options.camera;
		this.timer = _options.timer;
		this.text = _options.text;
		this.sceneIndex = _options.sceneIndex;

		this.initialPosition = new THREE.Vector3();
		this.movedPosition = new THREE.Vector3();

		this.backgroundColors = [0x0d3d51, 0x591810, 0x534708];

		this.crateXOffsetsFromCenterOfScene = [0, -1.75, -1];
		this.crateXOffsetsFromCenterOfCrate = [0, 0.35, -0.15];
		this.crateZOffsetsFromCenterOfCrate = [0, 0, -0.3];
		this.crateZRotations = [0, Math.PI / 3, Math.PI * 1.75];

		this.animationDuration = 3;
		this.animationDelay = this.animationDuration / 2;

		this.frontCrateSide = null;
		this.rotationsToOpenFrontCrateSide = [
			new THREE.Vector3(-Math.PI / 2, 0, 0),
			new THREE.Vector3(-0.608, -0.969, -1.004),
			new THREE.Vector3(0, 0, -Math.PI / 2)
		];

		this.load();
	}

	load() {
		this.setBackground();
		this.createBakedMaterials();
		this.addScene();
		this.initAnimations();
		this.initResponsivness();
		this.playStartAnimation();
	}

	setBackground() {
		if (!this.backgroundColors[this.sceneIndex]) return;

		this.scene.background = new THREE.Color(
			this.backgroundColors[this.sceneIndex]
		);
	}

	createBakedMaterials() {
		this.bakedMaterial = new THREE.MeshBasicMaterial({
			map: this.loader.getBakedTexture(),
			side: THREE.DoubleSide,
			transparent: true
		});

		this.skinnedBakedMaterial = this.bakedMaterial.clone();
		this.skinnedBakedMaterial.skinning = true;

		this.floorMaterial = this.bakedMaterial.clone();
		this.floorMaterial.side = THREE.FrontSide;

		this.createFlagShaderMaterial();
	}

	createFlagShaderMaterial() {
		this.flagTexture = this.loader.getTexture('flag');

		this.flagMaterial = new THREE.ShaderMaterial({
			vertexShader: flagVertexShader,
			fragmentShader: flagFragmentShader,
			uniforms: {
				uTime: { value: 0 },

				uTexture: { value: this.flagTexture }
			}
		});

		this.timer.runOnTick(() => {
			this.flagMaterial.uniforms.uTime.value = this.timer.getTime();
		});
	}

	addScene() {
		this.container = this.loader.getModel();
		this.traverseScene();
		this.scene.add(this.container);
		this.initialPosition = this.container.position.clone();
		this.movedPosition = this.initialPosition.clone();
	}

	traverseScene() {
		this.container.traverse(child => {
			this.applyBakedMaterialToMesh(child);
			this.checkIfMeshIsLight(child);
			this.checkIfMeshIsFlag(child);
			this.checkIfMeshIsSideOfCrate(child);
			this.checkIfMeshIsFloor(child);
		});
	}

	applyBakedMaterialToMesh(mesh) {
		if (
			!(mesh instanceof THREE.Mesh) ||
			!(mesh.material instanceof THREE.MeshStandardMaterial)
		)
			return;

		if (mesh instanceof THREE.SkinnedMesh)
			return (mesh.material = this.skinnedBakedMaterial);

		mesh.material = this.bakedMaterial;
	}

	checkIfMeshIsLight(mesh) {
		if (!(mesh instanceof THREE.Mesh)) return;

		if (mesh.name.includes('Light')) {
			mesh.material = new THREE.MeshBasicMaterial({
				color: '#B6F6FF'
			});
		}
	}

	checkIfMeshIsFlag(mesh) {
		if (!(mesh instanceof THREE.Mesh)) return;

		if (mesh.name.includes('Flag')) {
			mesh.material = this.flagMaterial;
		}
	}

	checkIfMeshIsSideOfCrate(mesh) {
		if (!(mesh instanceof THREE.Mesh)) return;

		if (mesh.name === 'Side1') this.frontCrateSide = mesh;
	}

	checkIfMeshIsFloor(mesh) {
		if (!(mesh instanceof THREE.Mesh)) return;
		if (mesh.name === 'Floor') mesh.material = this.floorMaterial;
	}

	initAnimations() {
		this.animations = this.loader.getAnimations();
		this.animationMixer = new THREE.AnimationMixer(this.container);

		this.animations.forEach(clip =>
			this.animationMixer.clipAction(clip).play()
		);

		this.timer.runOnTick(() =>
			this.animationMixer.update(this.timer.getDelta())
		);
	}

	initResponsivness() {
		this.addResponsiveFunction(() =>
			this.transformSceneAccordingToAspectRatio()
		);
	}

	transformSceneAccordingToAspectRatio() {
		if (this.aspectRatio > this.phoneRatio) {
			this.container.position.copy(this.initialPosition);
			this.movedPosition.copy(this.initialPosition);
			this.size = 'normal';
		}

		if (this.aspectRatio > this.minAspectRatio) {
			return this.container.scale.set(1, 1, 1);
		}

		const scaleFactor = this.aspectScaleFactor * 0.5 + 0.5;

		this.container.scale.set(scaleFactor, scaleFactor, scaleFactor);

		if (this.aspectRatio < this.phoneRatio && this.size !== 'phoneSize') {
			const frontCratePos = this.getComputedPositionOfFrontCrateSide();

			const translate = this.camera.lookingAt.x - frontCratePos.x;

			this.container.position.x =
				translate +
				this.crateXOffsetsFromCenterOfScene[this.sceneIndex];
			this.movedPosition.x =
				translate +
				this.crateXOffsetsFromCenterOfScene[this.sceneIndex];

			this.container.position.y = this.initialPosition.y - 1.75;
			this.movedPosition.y = this.initialPosition.y - 1.75;

			this.size = 'phoneSize';
		}

		this.container.position.y =
			this.movedPosition.y + (1 - this.aspectScaleFactor);
	}

	playStartAnimation() {
		this.animateClosingFrontCrateSide();
		this.showHTMLContent();

		const transitionToPos = this.getComputedPositionOfFrontCrateSide();

		this.camera.transitionTo(
			new THREE.Vector3(
				transitionToPos.x +
					this.crateXOffsetsFromCenterOfCrate[this.sceneIndex],
				transitionToPos.y + 0.25, // We add 0.25
				transitionToPos.z +
					0.25 +
					this.crateZOffsetsFromCenterOfCrate[this.sceneIndex] // and 0.25 to make camera transition to center of crate
			),
			{
				reverse: true,
				zRotation: this.crateZRotations[this.sceneIndex]
			}
		);

		this.text && this.text.playFadeAnimation();
	}

	animateClosingFrontCrateSide() {
		if (
			!this.frontCrateSide ||
			!this.rotationsToOpenFrontCrateSide[this.sceneIndex] ||
			this.animatingCurrently
		)
			return;
		this.animatingCurrently = true;

		const endRotation = this.frontCrateSide.rotation.clone();
		const startRotation =
			this.rotationsToOpenFrontCrateSide[this.sceneIndex];

		this.frontCrateSide.rotation.x += startRotation.x;
		this.frontCrateSide.rotation.y += startRotation.y;
		this.frontCrateSide.rotation.z += startRotation.z;

		gsap.to(this.frontCrateSide.rotation, {
			duration: this.animationDuration,
			x: endRotation.x,
			y: endRotation.y,
			z: endRotation.z,
			ease: 'power1.inOut'
		});

		this.setAnimatingToFalseWhenComplete();
	}

	setAnimatingToFalseWhenComplete() {
		const fullAnimationTime =
			(this.animationDuration + this.animationDelay) * 1000;

		setTimeout(() => (this.animatingCurrently = false), fullAnimationTime);
	}

	showHTMLContent() {
		const fullAnimationTime =
			(this.animationDuration + this.animationDelay) * 1000;
		setTimeout(() => {
			document.querySelector('.scene-content').classList.add('fade-in');
		}, fullAnimationTime - 500);
	}

	getComputedPositionOfFrontCrateSide() {
		this.container.updateMatrixWorld();
		const v = new THREE.Vector3();
		v.setFromMatrixPosition(this.frontCrateSide.matrixWorld);

		return v;
	}

	playRedirectAnimationAndRedirect(linkButtonIndex) {
		if (this.animatingCurrently) return;

		this.openFrontCrateSide();
		this.hideHTMLContent();

		const transitionToPos = this.getComputedPositionOfFrontCrateSide();

		this.camera.transitionTo(
			new THREE.Vector3(
				transitionToPos.x +
					this.crateXOffsetsFromCenterOfCrate[this.sceneIndex],
				transitionToPos.y + 0.25, // We add 0.25
				transitionToPos.z +
					0.25 +
					this.crateZOffsetsFromCenterOfCrate[this.sceneIndex] // and 0.25 to make camera transition to center of crate
			),
			{
				zRotation: this.crateZRotations[this.sceneIndex]
			}
		);

		this.text && this.text.playFadeAnimation();

		this.redirectToPageFromIndexWithDelay(
			linkButtonIndex,
			this.animationDuration + this.animationDelay
		);
	}

	openFrontCrateSide() {
		if (
			!this.frontCrateSide ||
			this.animatingCurrently ||
			!this.rotationsToOpenFrontCrateSide[this.sceneIndex]
		)
			return;

		this.animatingCurrently = true;

		const currentRotation = this.frontCrateSide.rotation;
		const rotationToApplyToOpenCrate =
			this.rotationsToOpenFrontCrateSide[this.sceneIndex];

		gsap.to(this.frontCrateSide.rotation, {
			duration: this.animationDuration,
			x: currentRotation.x + rotationToApplyToOpenCrate.x,
			y: currentRotation.y + rotationToApplyToOpenCrate.y,
			z: currentRotation.z + rotationToApplyToOpenCrate.z,
			ease: 'power4.in'
		});

		this.setAnimatingToFalseWhenComplete();
	}

	hideHTMLContent() {
		const htmlContent = document.querySelector('.scene-content');
		htmlContent.classList.remove('fade-in');
		htmlContent.classList.add('fade-out');
	}

	redirectToPageFromIndexWithDelay(linkButtonIndex, delay) {
		setTimeout(
			() => this.redirectToPageFromIndex(linkButtonIndex),
			delay * 1000
		);
	}

	redirectToPageFromIndex(linkButtonIndex) {
		if (linkButtonIndex === 0 || linkButtonIndex === 3) {
			window.location.href = '/';
		} else if (linkButtonIndex === 1 || linkButtonIndex === 4) {
			window.location.href = 'about.html';
		} else if (linkButtonIndex === 2 || linkButtonIndex === 5) {
			window.location.href = 'contact.html';
		}
	}
}
