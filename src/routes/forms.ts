import { create } from '$lib/index';

import PasswordLabel from './PasswordLabel.svelte';

export default create({
	login: {
		fields: {
			email: {
				type: 'email',
				placeholder: 'john.doe@example.com',
				validate: {
					isEmail: true
				}
			},
			password: {
				type: 'password',
				placeholder: '************',
				label: PasswordLabel,
				validate: {
					minLength: 5
					// maxLength: 255,
					// hasLength: true,
					// hasUppercase: true,
					// hasLowercase: true,
					// hasNumbers: true,
					// hasSpecial: true
				}
			},
			test: {
				type: 'select',
				options: [{ label: 'Test', value: 123 }]
			},
			rememberMe: {
				type: 'checkbox'
			}
		},
		buttons: {
			submit: {}
		}
	},
	passwordReset: {
		fields: {
			email: {
				type: 'email',
				required: true
			},
			resetToken: {
				type: 'password',
				required: true,
				pattern: /2+b+f+0+Z/
			}
		},
		buttons: {}
	},
	createAccount: {
		fields: {
			email: {
				type: 'email',
				placeholder: 'john.doe@example.com',
				required: true,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: 'password',
				placeholder: '************',
				description:
					'Pick a safe and secure password that has a minimum length of 8 characters, and includes at least one uppercase, lowercase, number and special character.',
				required: true,
				validate: {
					minLength: 8,
					hasUppercase: true,
					hasLowercase: true,
					hasNumbers: true
				}
			},
			'repeat-password': {
				type: 'password',
				placeholder: '************',
				description: 'To make sure you typed your password correctly, please repeat it again here.',
				required: true,
				validate: {
					sameAs: 'password'
				}
			}
		}
	}
});
