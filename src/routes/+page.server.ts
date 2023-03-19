import forms from './forms';
import { fail } from '@sveltejs/kit';

// NOTE: ALL ACTIONS MUST BE ASYNC!
export const actions = forms.createActions({
	login: async (event, { data, formData }) => {
		console.log(data.email, formData.get('email'));

		if (data === 'jack@gmail.com')
		{
			throw fail(400, {
				name: "'jack@gmail.com' is a reserved email. Please use a different one."
			});
		}

		return true;
	},
	createAccount: async ( event, { data, formData }) =>
	{

	},
	resetPassword: async ( event, { data, formData }) =>
	{

	},
});