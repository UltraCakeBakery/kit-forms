import forms from './forms';
import { fieldError } from '$lib/index';
import { redirect } from '@sveltejs/kit';

export const actions = forms.createActions({
	login: async (event, { data, formData }) => {
		console.log(data.email, formData.get('email'));

		if (data.email === 'jack@gmail.com') {
			throw fieldError('email', "'jack@gmail.com' is a banned email");
		}

		throw redirect(303, '/account-details');
	}
});
