import type { FormConfigurationFieldBase } from '../types';

export default {
	isEmail: 'Please enter a valid e-mail address.',
	hasLowercase: 'This field must contain at least one lowercase.',
	hasUppercase: 'This field must contain at least one uppercase.',
	hasNumbers: 'This field must contain at least one numeric character.',
	hasSpecial: 'This field must contain at least one special character.',
	hasLength: 'This field must be exactly %required_amount% characters long.',
	maxLength: 'This field cannot be longer than %required_amount% characters.',
	minLength: 'This field must be at least %required_amount% characters long.',
	maxLowercase: 'This field must contain at most %required_amount% lowercase characters.',
	minLowercase: 'This field must contain at least %required_amount% lowercase characters.',
	maxUppercase: 'This field must contain at most %required_amount% uppercase characters.',
	minUppercase: 'This field must contain at least %required_amount% uppercase characters.',
	maxNumbers: 'This field must contain at most %required_amount% numeric characters.',
	minNumbers: 'This field must contain at least %required_amount% numeric characters.',
	maxSpecial: 'This field must contain at most %required_amount% special characters.',
	minSpecial: 'This field must contain at least %required_amount% special characters.'
} satisfies FormConfigurationFieldBase['messages'];
