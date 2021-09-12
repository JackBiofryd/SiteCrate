import * as THREE from 'three';
import Timer from './Timer';
import Events from './Events';
import Loader from './Loader';
import Camera from './Camera';
import Text from './Text';
import ThreeScene from './ThreeScene';
import Button from './Button';

export default class ThreeApp {
	constructor(_pageIndex) {
		this.pageIndex = _pageIndex;

		this.canvas = document.querySelector('canvas.webgl');
		this.scene = new THREE.Scene();

		this.cameraLocations = [
			{
				pos: new THREE.Vector3(-1.8, 2.85, -9),
				lookAt: new THREE.Vector3(2.9, 1.4, 0)
			},
			{
				pos: new THREE.Vector3(1.25, 7.4, -15),
				lookAt: new THREE.Vector3(2.75, 2.4, 0)
			},
			{
				pos: new THREE.Vector3(-5.78, 6.53, -13.75),
				lookAt: new THREE.Vector3(-4.31, 3.05, 0)
			}
		];

		this.initTimer();
		this.initEvents();

		this.initLoaderAnd3DElements();
		this.initVanillaJS();

		history.scrollRestoration = 'manual';
		window.onbeforeunload = function () {
			window.scrollTo(0, 0);
		};
	}

	initTimer() {
		this.timer = new Timer();
	}

	initEvents() {
		this.events = new Events();
	}

	initLoaderAnd3DElements() {
		this.loader = new Loader(this.pageIndex, {
			loadFonts: this.pageIndex === 0,
			timer: this.timer,
			scene: this.scene
		});

		this.loader.runWhenLoadingFinishes(() => {
			this.initCamera();
			this.initRenderer();
			this.pageIndex === 0 && this.initText();
			this.initThreeScene();
			this.pageIndex === 0 && this.initButton();
			this.initRedirectEvents();
		});
	}

	initCamera() {
		const defaultVector = new THREE.Vector3();

		const currentCameraPosition =
			this.cameraLocations[this.pageIndex]?.pos || defaultVector;
		const currentCameraLookAt =
			this.cameraLocations[this.pageIndex]?.lookAt || defaultVector;

		this.camera = new Camera({
			timer: this.timer,
			events: this.events,
			x: currentCameraPosition.x,
			y: currentCameraPosition.y,
			z: currentCameraPosition.z
		});
		this.camera.lookAt(
			currentCameraLookAt.x,
			currentCameraLookAt.y,
			currentCameraLookAt.z
		);

		this.scene.add(this.camera.container);

		this.events.on('resize', () => this.camera.update());
	}

	initRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true
		});
		this.renderer.setSize(
			this.canvas.offsetWidth,
			this.canvas.offsetHeight
		);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.render(this.scene, this.camera.container);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ReinhardToneMapping;

		this.timer.runOnTick(() => {
			this.renderer.render(this.scene, this.camera.container);
		});

		this.events.on('resize', () => {
			this.renderer.setSize(
				this.canvas.offsetWidth,
				this.canvas.offsetHeight
			);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	initText() {
		this.text = new Text({
			scene: this.scene,
			camera: this.camera,
			events: this.events,
			loader: this.loader,
			timer: this.timer,
			x: -1.2,
			y: 0.6,
			z: -11,
			paragraphX: -3.45,
			paragraphY: -0.65,
			paragraphZ: -11
		});
	}

	initThreeScene() {
		this.threeScene = new ThreeScene({
			loader: this.loader,
			scene: this.scene,
			camera: this.camera,
			timer: this.timer,
			text: this.text,
			events: this.events,
			sceneIndex: this.pageIndex
		});
	}

	initButton() {
		const btnPos = this.text.position.clone();
		btnPos.add(new THREE.Vector3(-3.4, -1.9, 0));

		this.button = new Button({
			scene: this.scene,
			camera: this.camera,
			loader: this.loader,
			events: this.events,
			timer: this.timer,
			threeScene: this.threeScene,
			pos: btnPos
		});
	}

	initRedirectEvents() {
		const functionToRunOnLinkClick = linkButtonIndex => {
			this.threeScene.playRedirectAnimationAndRedirect(linkButtonIndex);
			if (this.button) this.button.playFadeAnimation();
		};

		this.events.initRedirectEvents(functionToRunOnLinkClick);
	}

	initVanillaJS() {
		document.querySelector('body').onclick = e => {
			if (e.target.classList.contains('menu-icon')) return;

			document.querySelector('.menu-links').classList.remove('active');
		};

		this.initScrollToTopBtn();
	}

	initScrollToTopBtn() {
		const scroller = document.querySelector('.scroll-to-top');

		if (!scroller) return;

		window.onscroll = () => {
			if (window.pageYOffset < 50) {
				scroller.classList.remove('fade-in');
				return scroller.classList.add('fade-out');
			}

			scroller.classList.remove('fade-out');
			scroller.classList.add('fade-in');
		};
	}
}
