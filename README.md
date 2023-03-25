# kit-forms - ![NPM License](https://img.shields.io/npm/l/kit-forms) [![npm version](https://badge.fury.io/js/kit-forms.svg)](https://badge.fury.io/js/kit-forms) 

Quickly generate secure, progessively enhanced `<form>`'s in your SvelteKit project.

- 🪄 Amazing developer experience due to minimal boilerplate.
- 🤖 A lot of busy work is done for you, intellegently and quickly.
- 👐🏻 Consistent surface level validation on both client and server side.
- ⚡ Native browser formvalidation first approach, for maximum compatibility and the best possible user experience.
- 🦯 Accessible and WCAG compliant components out of the box.
- 🤓 Fully typed using typescript, ~with automatic type declartion generation for action handlers~.
- 🏃🏻‍♂️ It is the fastest performing form validation library available for SvelteKit.
- 🚀 Cut your codebase in half and ship pages with forms faster then every before!

> 🧪 This library is a release-candidate state. Though all advertised features have been added and the documentation is being finalized, minor changes and bugs are still to be expected.

# Prerequisite

To use this library effectively you need a basic understanding of SvelteKit and its form actions workflow. This library supports edge runtimes and is cross-browser compatible. You can check our supported browsers list and caveats in the apendix of this documentation 
 
# Introduction
Creating and processing forms in SvelteKit is a hassle. It takes a lot of time to finetune even the most basic forms with a just a couple input fields. If you ever tried building complex SvelteKit apps, you can probably still see all those `try { const FormData = await event.request.formData(); } catch(error) { console.log(error)}`  when you close your eyes. 

## What is kit-forms
kit-forms is a library that provides to you a simple API for quickly generating user-friendly, progessively enhanced <form> elements. All generated forms are guaranteed to work when javascript is unavailable by automatically falling back to native browser formvalidation when possible. 

On the serverside kit-forms automatically parses the incoming `FormData` for you, so you do not need to `await event.request.formData()`. If any error occures while parsing, kit-forms will handle that error for you. When parsing the `FormData` is complete, kit-forms will validate the `FormData` against the exact same validations as the `<form>` in the browser did if javascript were to be available. If there is any discrepancy (which can occure when a user manipulates the form or uses a HTTP client like PostMan to post unexpected data) kit-forms will automatically throw errors back tot he form, displaying error messages under their corrosponding fields. 

TL:DR; When using kit-forms you can quickly generate forms that are fast, safe, secure and a joy to use. The only backend code you need to write is serverside-only security checks and data processing. kit-forms does all the boring and annoying stuff :D

NOTE: This library does not offer any stylesheets, CSS resets or additional validation packages. There are no default styles applied to the out-of-the-box components that are generated/shipped with this library.

# Installation

You can use your package manager of choice to install this package from npm.

```bash
$: npm install kit-forms --save-dev
$: pnpm install kit-forms --save-dev
$: yarn add kit-forms --dev
```

# How to use

This library expects you to follow a design pattern that fits right in how SvelteKit's "We should try to cramp everything, including your mom, in that `src/routes` folder" mentallity.

A lot is done for you out of the box. The only thing you need to do is configure your forms and their fields, place the generated form component in your layouts / pages their components and finally handle optionally process the FormData on the serverside.

###### STEP 1/3: Creating your forms

To create a form you can use our `create` method as shown in the example below. We recommend you keep all your forms located in the `src/routes` directory, but you are free to put it wherever you want, like `src/lib` or your own `src/forms` folder for example.

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
					'Pick a safe and secure password that has a minimum length of 8 characters, and includes atleast one uppercase, lowercase, number and special character.',
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

###### STEP 2/3: Mounting your forms

Import the `forms.js` file into the `+layout.svelte` and/or `+page.svelte` components in which you want to place the forms, mount the generated form component and optionally setup automatic snapshots:

```svelte
<script>
	import forms from './forms.js';

	export const snapshot = forms.snapshot; // This is optional!
</script>

<svelte:component this={forms.login} />
```

###### STEP 3/3: Handling form submisisons on the serverside (optional)

Import the `forms.js` file into your `+page.server.js`, generate the actions using the `forms.createActions` helper and process the form yourself. Remember: all forms have already been validated the same way they have been in the frontend. It is now up to you to do any crytical security checks yourself that can only take place on the serverside:

```js
// +page.server.js
import forms from './forms.js';
import { fieldError } from 'kit-forms';

export const actions = forms.createActions({
	login: async (event, { formData }) => {
		const email = formData.get('email');

		// This will throw an error shown below the email field.
		if (email === 'elon@twitter.com')
		{
			throw fieldError('email', 'Only if you give me a free space ride I will let you in.' );
		}

		...
	}
});
```

And that's it!

## Styling

The default form component has a `name` attribute. You can use this fact in combination with `:global` to style each form individually like so:

```svelte
<style>
	:global(form[name="login"] label) {
		font-weight: bold;
	}
</style>
```

Use inspect element to see the wrapper divs, which you can apply flex boxes on (or something else if that _floats_ your boat, pun intended) to (for example) position the labels correctly.

## Validation

Validation takes place both on the client side, as the serverside if you use our enhanced actions, automatically. By default fields only display errors when they lose focus, and after the form has been (attemted to be) submitted. You can read more about how you can do serverside valiation below.

## Build-in

Out of the box we offer tons of validation options, and add new ones every day. This makes it so that you rarely have to install an additional library.
We even offer helper functions to determine password strength, chance of a string being spam and more.

minLength: number
maxLength: number
hasLength: boolean
minUppercase: number
maxUppercase: number
hasUppercase: boolean
minLowercase: number
maxLowercase: number
hasLowercase: boolean
minNumbers: number
maxNumbers: number
hasNumbers: boolean
minSpecial: number
maxSpecial: number
hasSpecial: boolean
minRegexMatches: number
maxRegexMatches: number
hasRegexMatch: boolean
isEmail: boolean
isSame: string

### Custom validations

Simply pass a `(value, field, form) => true` function and do your own checks there. NOTE: these are shared with the client! do not include sensitive data in here, or checks that can only run on the serverside! Read the next section for password checks and such:

### Serverside validation

Any clientside validation automatically happens on the serverside too. Any additional serverside only validation must happen in the actions handler. We do not offer any abstractions for this. We do however automatically map errors thrown using `fail` to their corrosponding form inputs.

```js
// +page.server.js
import forms from './forms.js';
import { fail } from '@sveltejs/kit';

const blacklist = ['spam@test.com'];

export const actions = forms.createActions({
	login: async (event, form) => {
		if (blacklist.includes(form.data.get('email')))
			throw fail(400, { email: 'Email is blacklisted. Please use a different one.' });

		// ...
	}
});
```

## Snapshots

By default all forms and all their fields are stored in snapshots. This also includes passwords, for which you will be warned in your console.
To apply snapshots automatically `export let snapshot = forms.snapshot` to the page that contains the forms.

### Configuring snapshots

To disable snapshots for one form or specific fields, set `snapshot` to `false` on their corrosponding config objects:

```js
// forms.js
import { create } from 'kit-forms'

export default create(
    {
        name: 'login',
        snapshot: false, // turns off snapshot for the entire form
        fields: {
            password: {
                snapshot: false, // turns off snapshot for only this field
                ...
```

## Custom form and field components

To set your own form or field components, just overwrite them in the config:

```js
// forms.js
import { create } from 'kit-forms'
import Form from '$lib/Form.svelte' // your own form component
import FormField from '$lib/FormField.svelte' // your own form component

export default create(
    {
        name: 'login',
        component: Form,
        fields: {
            password: {
                component: FormField,
                ...
```
