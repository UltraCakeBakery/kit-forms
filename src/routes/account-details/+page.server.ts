import forms from './forms';

// NOTE: ALL ACTIONS MUST BE ASYNC!
export const actions = forms.createActions({
	accountDetails: async (event, { data, formData }) => {
		return true;
	}
});