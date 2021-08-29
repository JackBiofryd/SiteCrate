import ThreeApp from './ThreeApp';
import Scroll from './Scroll';
import TagCloud from './TagCloud';
import './style.css';

const app = new ThreeApp(0);

initTags();
initScrollAnimations();

function initTags() {
	const myTags = [
		'Beautiful Websites',
		'Full Stack Applications',
		'Professional Designs',
		'E-commerce Stores',
		'3D Web Experiences',
		'Personal Portfolios',
		'Social Media Websites',
		'Informational Websites'
	];

	addTagsToDOM(myTags);

	handleClickOnTags();

	app.events.on('resize', () => {
		addTagsToDOM(myTags);
		handleClickOnTags();
	});
}

function addTagsToDOM(tags) {
	let radius = 275;
	if (window.innerWidth < 600) radius = (window.innerWidth - 75) / 2;

	document.querySelector('.offers').innerHTML = '';

	TagCloud('.offers', tags, {
		radius: radius,
		initSpeed: 'normal',
		maxSpeed: 'fast',
		direction: -50,
		keep: true
	});
}

function handleClickOnTags() {
	const tags = document.querySelectorAll('.tagcloud--item');
	const offerExplanations = document.querySelectorAll('.explanation');
	console.log(tags);

	document.querySelector('.offers').addEventListener('click', e => {
		if (!e.target.classList.contains('tagcloud--item')) return;

		tags.forEach((tag, index) => {
			if (tag === e.target) {
				offerExplanations[index].classList.add('fade-in');
				return (offerExplanations[index].style.display = 'block');
			}

			offerExplanations[index].style.display = 'none';
		});
	});
}

function initScrollAnimations() {
	const scroll = new Scroll();
	scroll.initHomePageAnimations();
}
