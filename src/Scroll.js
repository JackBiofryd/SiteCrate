import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default class Scroll {
	constructor() {
		gsap.registerPlugin(ScrollTrigger);
	}

	initHomePageAnimations() {
		this.createOffersTransition();
		this.createChoseUsTransition();
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

	createChoseUsTransition() {
		this.transitionChoseUsBackground();
		this.hideChoseUsContent();
		this.showQuotes();
	}

	transitionChoseUsBackground() {
		this.choseUsTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.chose-us-section',
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
				pin: false
			}
		});

		this.choseUsTimeline.addLabel('start');
		this.choseUsTimeline.to(
			'.offers-container',
			{
				background: '#0d3d51',
				duration: 1
			},
			'start'
		);
		this.choseUsTimeline.to(
			'.chose-us-section',
			{ background: '#0d3d51', duration: 1 },
			'start'
		);
		this.choseUsTimeline.to(
			'.overlay-shape',
			{ duration: 2, translateY: 0 },
			'start'
		);
	}

	hideChoseUsContent() {
		this.hideChoseUsTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.chose-us-section',
				start: 'bottom bottom',
				end: '+=200%',
				scrub: true,
				pin: true,
				anticipatePin: 1
			}
		});

		this.hideChoseUsTimeline.addLabel('start');
		this.hideChoseUsTimeline.to(
			'.shape',
			{
				yPercent: 100,
				duration: 10,
				ease: 'power1.inOut'
			},
			'start'
		);
		this.hideChoseUsTimeline.to(
			'.human',
			{
				yPercent: 100,
				xPercent: -100,
				duration: 10,
				ease: 'power1.inOut'
			},
			'start'
		);
		this.hideChoseUsTimeline.to(
			'.text-container',
			{
				xPercent: 100,
				duration: 15,
				ease: 'power1.inOut'
			},
			'start'
		);
	}

	showQuotes() {
		this.moveQuotes = window.innerWidth > 768;

		this.hideChoseUsTimeline.addLabel('showQuotes');
		this.hideChoseUsTimeline.to(
			'.quotes',
			{
				ease: 'power1.inOut',
				yPercent: -110,
				duration: 25
			},
			'showQuotes'
		);

		if (!this.moveQuotes) return;

		const quotes = document.querySelectorAll('.quote');
		for (let i = 0; i < quotes.length; i++) {
			let distance = 40;
			if (i % 2 === 0) distance *= -1;

			this.hideChoseUsTimeline.to(
				quotes[i],
				{
					xPercent: distance,
					duration: 25,
					ease: 'power1.inOut'
				},
				'showQuotes'
			);
		}
	}

	initAboutPageAnimations() {
		this.aboutTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: '.journey-section',
				start: 'top bottom',
				end: 'top top',
				scrub: true,
				pin: false
			}
		});

		this.aboutTimeline.addLabel('start');
		this.aboutTimeline.to(
			'.scene-overlay',
			{ opacity: 1, duration: 1 },
			'start'
		);
		this.aboutTimeline.to(
			'#revealer',
			{ background: '#fafafa', duration: 1 },
			'start'
		);

		this.addRevealContentAnimations();
	}

	addRevealContentAnimations() {
		const journeySections = gsap.utils.toArray('.journey-content');

		journeySections.forEach(section => {
			gsap.to(section, {
				scrollTrigger: {
					trigger: section,
					start: '25% bottom',
					end: '25% 50%',
					scrub: true
				},
				opacity: 1,
				duration: 1
			});
		});

		gsap.to('.confetti', {
			opacity: 1,
			duration: 1,
			scrollTrigger: {
				trigger: '.confetti-section',
				start: '35% bottom',
				end: '100% bottom',
				scrub: true
			}
		});
	}
}
