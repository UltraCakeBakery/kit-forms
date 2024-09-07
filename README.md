# kit-forms - ![NPM License](https://img.shields.io/npm/l/kit-forms) [![npm version](https://badge.fury.io/js/kit-forms.svg)](https://badge.fury.io/js/kit-forms) ![GitHub Repo stars](https://img.shields.io/github/stars/UltraCakeBakery/kit-forms)



Quickly generate secure, progressively enhanced `<form>` elements in your SvelteKit project.

- 🪄 Excellent developer experience with minimal boilerplate.
- 🤖 Automated, intelligent, and quick handling of repetitive tasks.
- 👐🏻 Consistent validation on both client and server sides.
- ⚡ Native browser form validation first approach, ensuring maximum compatibility and an optimal user experience.
- 🦯 Accessible and WCAG-compliant components out of the box.
- 🤓 Fully typed using TypeScript.
- 🏃🏻‍♂️ The fastest performing form validation library available for SvelteKit.
- 🚀 Reduce your codebase and ship pages with forms faster than ever before!

> 🧪 This library is in a release-candidate state. While all advertised features have been added and documentation is being finalized, minor changes and bugs may still occur.

# Prerequisite

To use this library effectively, you need a basic understanding of SvelteKit and its form actions workflow. This library supports edge runtimes and is cross-browser compatible. Check the appendix of this documentation for a list of supported browsers and any caveats.

# Introduction

Creating and processing forms in SvelteKit can be a hassle. It takes a lot of time to fine-tune even the most basic forms with just a couple of input fields. If you've ever tried building complex SvelteKit apps, you probably remember all those `try { const FormData = await event.request.formData(); } catch(error) { console.log(error) }` lines when you close your eyes.

## What is kit-forms?

kit-forms is a library that provides a simple API for quickly generating user-friendly, progressively enhanced `<form>` elements. All generated forms are guaranteed to work even when JavaScript is unavailable by automatically falling back to native browser form validation whenever possible.

On the server side, kit-forms automatically parses the incoming `FormData` for you, so you don't need to `await event.request.formData()`. If any errors occur while parsing, kit-forms will handle them for you. After parsing is complete, kit-forms will validate the `FormData` against the exact same validations that the `<form>` would have in the browser if JavaScript were available. If there is any discrepancy (which can occur when a user manipulates the form or uses an HTTP client like Postman to post unexpected data), kit-forms will automatically throw errors back to the form, displaying error messages under their corresponding fields.

**TL;DR:** When using kit-forms, you can quickly generate forms that are fast, safe, secure, and a joy to use. The only backend code you need to write is for server-side-only security checks and data processing that is specific to your application. kit-forms handles all the boring and annoying stuff :D

**Note:** This library does not offer any stylesheets, CSS resets, or additional validation packages. There are no default styles applied to the out-of-the-box components generated by this library.

# Installation

You can use your package manager of choice to install this package from npm.

```bash
$: npm install kit-forms --save-dev
$: pnpm install kit-forms --save-dev
$: yarn add kit-forms --dev
```

# How to Use

This library expects you to follow a design pattern that aligns with SvelteKit's approach of centralizing most of your code in the `src/routes` folder.

A lot is done for you out of the box. The only tasks you need to handle are configuring your forms and their fields, placing the generated form component in your layouts/pages, and optionally processing the `FormData` on the server side.

###### STEP 1/3: Creating Your Forms

To create a form, use the `create` method as shown in the example below. We recommend keeping all your forms in the `src/routes` directory, but you're free to place them wherever you want, such as `src/lib` or a custom `src/forms` folder.

```js
// forms.js
import { create } from 'kit-forms';

export default create({
	login: {
		fields: {
			email: {
				type: 'email',
				required: true,
				placeholder: 'john.doe@example.com',
			},
			password: {
				type: 'password',
				placeholder: '************',
				required: true,
				description:
					'Pick a safe and secure password that has a minimum length of 8 characters, and includes at least one uppercase letter, lowercase letter, number, and special character.',
				validate: {
					minLength: 8,
					hasLowercase: true,
					hasUppercase: true,
					hasNumbers: true,
					hasSpecial: true
				}
			}
		}
	}
});
```

###### STEP 2/3: Mounting Your Forms

Import the `forms.js` file into the `+layout.svelte` and/or `+page.svelte` components where you want to place the forms, mount the generated form component, and optionally set up automatic snapshots:

```svelte
<script>
	import forms from './forms.js';

	export const snapshot = forms.snapshot; // This is optional!
</script>

<svelte:component this={forms.login} />
```

###### STEP 3/3: Handling Form Submissions on the Server Side

Import the `forms.js` file into your `+page.server.js`, generate the actions using the `forms.createActions` helper, and process the automatically validated and parsed form yourself. It is here where you perform additional validations yourself, like critical security checks that can only take place on the server side such as password validation, rate limits, blacklists, etc:

```js
// +page.server.js
import forms from './forms.js';
import { fieldError } from 'kit-forms';

export const actions = forms.createActions({
	login: async (event, { formData }) => {
		const email = formData.get('email');

		// This will throw an error shown below the email field.
		if (email === 'elon@twitter.com') {
			throw fieldError('email', 'Only if you give me a free space ride will I let you in.' );
		}

		// ...
	}
});
```

And that's it!

## Styling

The default form component has a `name` attribute. You can use this attribute in combination with `:global` to style each form individually:

```svelte
<style>
	:global(form[name="login"] label) {
		font-weight: bold;
	}
</style>
```

Use the browser's inspect element tool to see the wrapper divs, which you can apply flexbox or other CSS to position labels and other elements as needed.

## Validation

Validation occurs on both the client and server sides. Initially, native browser validation runs on the client side until SvelteKit fully hydrates the page (i.e., JavaScript has loaded). Once hydration is complete and our form component has mounted, applying our enhanced action to the form will enable client-side JavaScript validation. 

On the server side, if you use the `createActions` helper, it will validate the form before executing the action handler. Any field errors found will be reported to the user, and `request.formData()` will be called and made available for you before proceeding with the action.

By default, fields display errors only after they lose focus or when the form has been (attempted to be) submitted. More information about server-side validation is provided below.

## Built-in Validation

Out of the box, we offer a wide range of validation options, with new ones added regularly. This reduces the need to install additional libraries. We even offer helper functions to determine password strength, detect potential spam, and more.

### Available validations:
> ⚠️ This list assumes you are relying on server-side validation. Do not assume these validations to all work together, or when the page is not hydrated. We will update the readme in the near future to better explain. For now, just try around yourself.

| **Type** | **Supported Validations**                                                                                                                                                                      |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **text**       | `minLength`, `maxLength`, `hasLength`, `minUppercase`, `maxUppercase`, `hasUppercase`, `minLowercase`, `maxLowercase`, `hasLowercase`, `minNumbers`, `maxNumbers`, `hasNumbers`, `minSpecial`, `maxSpecial`, `hasSpecial`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isSame` |
| **password**   | `minLength`, `maxLength`, `hasLength`, `minUppercase`, `maxUppercase`, `hasUppercase`, `minLowercase`, `maxLowercase`, `hasLowercase`, `minNumbers`, `maxNumbers`, `hasNumbers`, `minSpecial`, `maxSpecial`, `hasSpecial`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isSame` |
| **email**      | `minLength`, `maxLength`, `hasLength`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isEmail`, `isSame`                                                                               |
| **search**     | `minLength`, `maxLength`, `hasLength`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isSame`                                                                                          |
| **url**        | `minLength`, `maxLength`, `hasLength`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isSame`                                                                                          |
| **tel**        | `minLength`, `maxLength`, `hasLength`, `minNumbers`, `maxNumbers`, `hasNumbers`, `minRegexMatches`, `maxRegexMatches`, `hasRegexMatch`, `isSame`                                                |

### Custom Validations

Simply pass a function `(value, field, form) => true` to perform your own checks. **Note:** These functions are shared with the client, so do not include sensitive data or checks that can only run on the server side! For server-side validation, see the next section.

### Server-Side Validation

Any client-side validation is automatically applied on the server side as well. Any additional server-side-only validation must happen in the actions handler. We do not offer any abstractions for this, but we do automatically map errors thrown using `fail` to their corresponding form inputs.

```js
// +page.server.js
import forms from './forms.js';
import { fail } from '@sveltejs/kit';

const blacklist = ['spam@test.com'];

export const actions = forms.createActions({
	login: async (event, form) => {
		if (blacklist.includes(form.data.get('email'))) {
			throw fail(400, { email: 'Email is blacklisted. Please use a different one.' });
		}

		// ...
	}
});
```

## Snapshots

By default, all forms and their fields are stored in snapshots, including passwords (for which you'll receive a console warning). To apply snapshots automatically, `export let snapshot = forms.snapshot` in the page that contains the forms.

### Configuring Snapshots

To disable snapshots for a specific form or specific fields, set `snapshot` to `false` on their corresponding config objects:

```js
// forms.js
import { create } from 'kit-forms'

export default create({
	name: 'login',
	s

napshot: false, // turns off snapshots for the entire form
	fields: {
		password: {
			snapshot: false, // turns off snapshots for only this field
			// ...
		}
	}
});
```

## Custom Form and Field Components

To use your own form or field components, simply override them in the config:

```js
// forms.js
import { create } from 'kit-forms'
import Form from '$lib/Form.svelte' // your own form component
import FormField from '$lib/FormField.svelte' // your own form field component

export default create({
	name: 'login',
	component: Form,
	fields: {
		password: {
			component: FormField,
			// ...
		}
	}
});
```

## Appendix

###### Supported browsers
The library is compatible with the same browsers as SvelteKit. For details on specific validation rules, please refer to caniuse.com. By default, our library only applies native attributes.
