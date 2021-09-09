import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Loader {
	constructor(pageIndex) {
		this.index = pageIndex;

		this.loadingBar = document.querySelector('#loader');

		this.loadingManager = new THREE.LoadingManager();

		this.loadingManager.onProgress = (url, loaded, total) =>
			this.onprogress(loaded, total);

		this.gltfLoader = new GLTFLoader(this.loadingManager);
		this.textureLoader = new THREE.TextureLoader(this.loadingManager);
		this.fontLoader = new THREE.FontLoader(this.loadingManager);

		this.bakedTextureUrls = [
			'baked.png',
			'aboutBaked.jpg',
			'contactBaked.jpg'
		];
		this.bakedModelUrls = [
			'crate.glb',
			'aboutCrate.glb',
			'contactCrate.glb'
		];

		this.textureUrls = {
			flag: 'flag.jpg',
			btn: 'btn.png'
		};
		this.textures = {};

		this.disableScrolling();
		this.loadBakedTexture();
		this.loadModel();
		this.loadTextures();
	}

	onprogress(itemsLoaded, itemsTotal) {
		const currentProgress = itemsLoaded / itemsTotal;
		this.loadingBar.style.transform = `scaleX(${currentProgress})`;
	}

	disableScrolling() {
		document.querySelector('html').style.overflow = 'hidden';
	}

	loadBakedTexture() {
		if (!this.bakedTextureUrls[this.index]) return;

		this.texture = this.textureLoader.load(
			this.bakedTextureUrls[this.index]
		);
		this.texture.encoding = THREE.sRGBEncoding;
		this.texture.flipY = false;
	}

	loadModel() {
		if (!this.bakedModelUrls[this.index]) return;

		this.gltfLoader.load(this.bakedModelUrls[this.index], gltf => {
			this.gltf = gltf;
			this.model = this.gltf.scene;
		});
	}

	loadTextures() {
		for (let textureName in this.textureUrls) {
			const texture = this.textureLoader.load(
				this.textureUrls[textureName]
			);
			texture.encoding = THREE.sRGBEncoding;

			this.textures[textureName] = texture;
		}
	}

	runWhenLoadingFinishes(func) {
		this.loadingManager.onLoad = () => {
			this.hideLoadingScreen();
			func();
		};
	}

	hideLoadingScreen() {
		const loadingScreen = document.querySelector('.loading-screen');
		loadingScreen.classList.add('loading-finished');

		this.enableScroll();
	}

	enableScroll() {
		window.scrollTo(0, 0);
		document.querySelector('html').style.overflowX = 'hidden';
		document.querySelector('html').style.overflowY = 'overlay';
	}

	getBakedTexture() {
		return this.texture;
	}

	getModel() {
		return this.model;
	}

	getAnimations() {
		return this.gltf.animations;
	}

	getTexture(name) {
		return this.textures[name];
	}
}
