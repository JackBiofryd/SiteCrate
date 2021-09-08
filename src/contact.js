import emailjs from 'emailjs-com';
import ThreeApp from './ThreeApp';
import './style.css';

new ThreeApp(2);

const contactForm = document.querySelector('form');
contactForm.onsubmit = sendEmail;

function sendEmail(e) {
	e.preventDefault();

	emailjs
		.sendForm(
			'service_xvrk597',
			'template_z2410va',
			e.target,
			'user_H3pi7ru9LUS0f6wRFqfyI'
		)
		.then(
			result => {
				document.querySelector('.btn-submit').value =
					'Sent! We respond quickly.';
				e.target.reset();
			},
			error => {
				document.querySelector('.btn-submit').value =
					'Error! Please try again.';
				console.log(error.text);
			}
		);
}
