import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default class Scroll {
	constructor() {
		gsap.registerPlugin(ScrollTrigger);
	}

	initHomePageAnimations() {
		window.addEventListener('DOMContentLoaded', () => {
			this.createOffersTransition();
			this.createTestimonialsTransition();
			this.createTestimonialsSlider();
		});

		window.addEventListener('resize', () =>
			this.createTestimonialsSlider()
		);
	}

	createOffersTransition() {
		this.offersTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.offers-container',
				start: 'top bottom',
				end: 'top top',
				scrub: true,
				pin: false
			}
		});

		this.offersTimeline.addLabel('start');
		this.offersTimeline.to(
			'.scene-overlay',
			{ opacity: 1, duration: 1 },
			'start'
		);
		this.offersTimeline.to(
			'.offers-container',
			{ background: '#fafafa', duration: 1 },
			'start'
		);
	}

	createTestimonialsTransition() {
		this.testimonialsTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.testimonials-section',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
				pin: false
			}
		});

		this.testimonialsTimeline.addLabel('start');
		this.testimonialsTimeline.to(
			'.offers-container',
			{
				background: '#0d3d51',
				duration: 1
			},
			'start'
		);
		this.testimonialsTimeline.to(
			'.testimonials-section',
			{ background: '#0d3d51', duration: 1 },
			'start'
		);
		this.testimonialsTimeline.to(
			'.overlay-shape',
			{ duration: 2, translateY: 0 },
			'start'
		);
	}

	createTestimonialsSlider() {
		this.testSlider = null;

		const testimonialsWidth =
			document.querySelector('.testimonials').clientWidth;
		const containerWidth = document.querySelector(
			'.testimonials-container'
		).clientWidth;

		const translateValue = testimonialsWidth - containerWidth + 16;

		this.testSlider = gsap.to('.testimonials', {
			translateX: `-${translateValue}px`,
			duration: 10,
			ease: 'power1.inOut',
			scrollTrigger: {
				trigger: '.testimonials-container',
				start: 'bottom bottom',
				scrub: true,
				pin: '.testimonials-section',
				anticipatePin: 1
			}
		});
	}

	initAboutPageAnimations() {
		this.video = document.querySelector('video');
		if (!this.video) return;

		this.aboutTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.test',
				start: 'top top',
				scrub: true,
				pin: true,
				onUpdate: trigger => {
					this.video.currentTime =
						trigger.progress * this.video.duration;
				}
			}
		});
	}
}
