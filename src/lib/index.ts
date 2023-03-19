// TODO: remove the eslint disable lines
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Actions, RequestEvent } from '@sveltejs/kit';
import type {
	Configuration,
	HTMLInputTypeAttribute,
	ParsedFormConfiguration,
	ParsedFormConfigurationButton,
	ParsedFormConfigurationField,
	ValidationRules
} from './types';
import { get, writable } from 'svelte/store';
import Form from './components/Form.svelte';
import FormInput from './components/FormInput.svelte';
import {
	regexes,
	messages,
	consts,
	fieldNameToLabelConverter,
	countLowercaseChars,
	countUppercaseChars,
	countNumberChars
} from './utils';

/**
 * Use this function to create your forms. It takes an object where each property is a (form) Configuration.
 * It returns an object where each property is a svelte component, ready for you to mount through <svelte:component this={}>
 * in your svelte components.
 */
export function create(configuration: Configuration) {
	const parsedFormConfigurations = parseConfiguration(configuration);

	return new Proxy(
		{},
		{
			get(target: { [key: string | symbol]: any }, prop) {
				// https://github.com/UltraCakeBakery/kit-forms/tree/main#step-23-mounting-your-forms
				if (prop === 'snapshot') {
					return createSnapshotConfig(parsedFormConfigurations);
				}

				// https://github.com/UltraCakeBakery/kit-forms/tree/main#step-23-mounting-your-forms
				if (prop === 'createActions') {
					return (actions: Actions) => createActions(parsedFormConfigurations, actions);
				}

				// Find the specific form the user is trying to access
				const parsedFormConfiguration = parsedFormConfigurations.find((form) => form.name === prop);

				if (!parsedFormConfiguration) return target[prop];

				if (typeof Form === 'object')
					return new Proxy(Form, {
						get: (target: { [key: string | symbol]: any }, prop) => {
							if (prop === 'render')
								return (props: any, { $$slots = {}, context = new Map() } = {}) => {
									return target.render(
										{ form: parsedFormConfiguration, ...props },
										{ $$slots, context }
									);
								};

							if (prop === '$$render')
								return (result: any, props: any, bindings: any, slots: any, context: any) => {
									return target.$$render(
										result,
										{ form: parsedFormConfiguration, ...props },
										bindings,
										slots,
										context
									);
								};

							return target[prop];
						}
					});

				// HMR ProxyComponent stuff workaround
				return class extends Form {
					constructor(options: unknown) {
						super({
							...(options as any),
							props: { form: parsedFormConfiguration, ...((options as any)?.props ?? {}) }
						});
					}
				};
			}
		}
	);
}

/**
 * This function takes the users `forms.ts` configuration (the object passed to `create()`)
 * and returns an array of parsed form configurations. During the parsing we prepare writable stores,
 * apply default options and pre-format some other properties passed to the Form.svelte components.
 */
function parseConfiguration(config: Configuration) {
	const forms = Object.entries(config);
	return forms.map(([formName, formConfiguration]) => {
		const fields = Object.entries(formConfiguration.fields || {}).map(
			([name, fieldConfiguration]) => {
				if (
					(fieldConfiguration.type as string) === 'button' ||
					(fieldConfiguration.type as string) === 'submit' ||
					fieldConfiguration.type === 'reset'
				) {
					throw new Error(
						`fields of type \`${fieldConfiguration.type}\` are not allowed. Please configuration regular <button> elements instead.`
					);
				}

				const field = {
					name,
					type: fieldConfiguration.type,
					placeholder: fieldConfiguration.placeholder,
					description: fieldConfiguration.description,
					options: fieldConfiguration.options,
					required: fieldConfiguration.required,
					rows: fieldConfiguration.rows,
					readonly: fieldConfiguration.readonly,
					disabled: fieldConfiguration.disabled,
					hidden: fieldConfiguration.hidden,
					pattern: fieldConfiguration.pattern
						? fieldConfiguration.pattern.toString().split('/')[1]
						: null,
					validate: fieldConfiguration.validate,
					autocomplete: [false, null].includes(!!fieldConfiguration.autocomplete)
						? 'off'
						: fieldConfiguration.autocomplete,
					id: fieldConfiguration.id ?? `${formName}-${name}`, // default <input id=""> is equal to form name and name of the input.
					component: fieldConfiguration.component ?? FormInput,
					label:
						fieldConfiguration.label === undefined
							? fieldNameToLabelConverter(name) // if no label has been set by the user in the config, generate our own based on its name
							: fieldConfiguration.label !== null // if label has not explicitly set to null, use whatever value they have set as the label
							? fieldConfiguration.label
							: null, // set no label (hide label) if explicitly passed `null` in config
					value: writable(fieldConfiguration.value ?? null), // writable stores containing the value of the input
					localErrors: writable([...((fieldConfiguration.errors as unknown as string[]) || [])]), // writable stores containing the realtime errors in the frontend (client)
					serverErrors: writable([]), // writable stores containing the errors returned from the actions (server)
					messages: { ...messages, ...(fieldConfiguration.messages || {}) }
				} as unknown as ParsedFormConfigurationField; // we cast to unkown to hack around typescript limitations / bad typing due to missing types from svelte

				// generate events you can use inside the Form component
				field.events = {
					onInput: (event: any) => {
						// Using `any` due to the lack of browser event types available here in our node dev env.
						event?.preventDefault();
						field.value.set(event.target.value); // write value to store
						field.serverErrors.set([]); // set server errors to null and rely on validation happening on the client side

						if (formConfiguration.errorsOnInput) {
							writeFieldErrors(field, field.localErrors); // if user has enabled that errors should display as you are typing, do so.
						} else {
							field.localErrors.set([]); // by default, we remove all errors when the user starts typing again.
						}
					},
					onBlur: (event: any) => {
						// when user clicks outside the input, or focuses on something else, remove server errors and validate input / show clientside errors
						field.serverErrors.set([]);
						writeFieldErrors(field, field.localErrors);
					}
				};

				return field;
			}
		);

		const buttons = Object.keys(formConfiguration.buttons || {}).length
			? Object.entries(formConfiguration.buttons || {}).map(([name, buttonConfiguration]) => {
					// form buttons configuration. Here we do almost the same thing as for the fields above ^
					return {
						name,
						type: buttonConfiguration.type,
						label:
							buttonConfiguration.label === undefined
								? fieldNameToLabelConverter(name)
								: buttonConfiguration.label !== null
								? buttonConfiguration.label
								: null,
						value: buttonConfiguration.value
					} as unknown as ParsedFormConfigurationButton;
			  })
			: [{ type: 'submit', label: 'submit form' }];

		const form = {
			name: formName,
			method: formConfiguration.method ?? 'POST', // default to 'POST' method if none has been set
			action: formConfiguration.action ?? `?/${formName}`, // set default form action url if none is generated (check generateActions function!)
			id: formConfiguration.id,
			component: formConfiguration.component ?? Form, // allow user to overwrite the Form component so they can bring their own
			$$config: formConfiguration,
			buttons,
			fields
		};

		return form;
	}) as unknown as ParsedFormConfiguration[];
}

/**
 * This function is where validation happens.
 *
 * 1. You pass the field object that holds the validations and other configurations
 * 2. You pass the writable([]) we should set the list of errors in
 * 3. optional: pass formData (used on serverside in actions) where we should get the value from instead.
 */
export function writeFieldErrors(
	field: ParsedFormConfigurationField,
	errors: any,
	formData: FormData | undefined = undefined
) {
	if (!field.validate) return true;

	const _errors = [] as string[];
	const value = String(formData ? formData.get(field.name) : get(field.value));

	for (const validation of Object.keys(field.validate) as Array<keyof ValidationRules>) {
		let isValid = true;
		let condition;
		switch (validation) {
			case 'isEmail':
				condition = field.validate[validation];
				isValid = condition === true && regexes.email.test(value);
				break;
			case 'hasLength':
				isValid = !value?.length;
				break;
			case 'minLength':
				condition = field.validate[validation] ?? 0;
				isValid = value?.length > condition;
				break;
			case 'maxLength':
				condition = field.validate[validation] ?? Infinity;
				isValid = value?.length < condition;
				break;
			case 'hasLowercase':
				isValid = regexes.lowercase.test(value);
				break;
			case 'minLowercase':
				condition = field.validate[validation] ?? 0;
				isValid = countLowercaseChars(value) >= condition;
				break;
			case 'maxLowercase':
				condition = field.validate[validation] ?? Infinity;
				isValid = countLowercaseChars(value) <= condition;
				break;
			case 'hasUppercase':
				isValid = regexes.uppercase.test(value);
				break;
			case 'minUppercase':
				condition = field.validate[validation] ?? 0;
				isValid = countUppercaseChars(value) >= condition;
				break;
			case 'maxUppercase':
				condition = field.validate[validation] ?? Infinity;
				isValid = countUppercaseChars(value) <= condition;
				break;
			case 'hasNumbers':
				isValid = regexes.numbers.test(value);
				break;
			case 'minNumbers':
				condition = field.validate[validation] ?? 0;
				isValid = countNumberChars(value) >= condition;
				break;
			case 'maxNumbers':
				condition = field.validate[validation] ?? Infinity;
				isValid = countNumberChars(value) <= condition;
				break;
			case 'hasSpecial':
				isValid = regexes.special.test(value);
				break;
			case 'minSpecial':
				condition = field.validate[validation] ?? 0;
				isValid =
					Array.from(value).filter((char) => consts.specials.includes(char)).length >= condition;
				break;
			case 'maxSpecial':
				condition = field.validate[validation] ?? Infinity;
				isValid =
					Array.from(value).filter((char) => consts.specials.includes(char)).length <= condition;
				break;
			case 'isUrl':
				isValid = regexes.url.test(value);
				break;
			case 'isSecureUrl':
				isValid = regexes.secureUrl.test(value);
				break;
			default:
				break;
		}
		!isValid &&
			_errors.push(
				field.messages?.[validation]?.replace(/%required_amount%/g, String(condition)) ||
					'Missing error message for ' + validation
			); // || defaultMessages.get(validation, condition, field )
	}

	errors.set(_errors);
}

/**
 * Use this function in your `+page.js` or `+page.server.js` files.
 * It wraps your action handlers inside a middleware that checks the forms fields against your
 * configured validations. If anything is not valid, it will automatically return errors to your frontend.
 * Anything you return from this function will be passed to the correct form.
 */
export function createActions( // TODO: better documentation... but this is still unfinished. Jack will get back to this later.
	parsedFormConfigurations: ParsedFormConfiguration[],
	actions: { [form: string]: (event: RequestEvent, form: any) => any }
) {
	const enhancedActions: { [form: string]: (event: RequestEvent) => any } = {};

	for (const form of parsedFormConfigurations) {
		enhancedActions[form.name] = async (event: RequestEvent) => {
			const formData = await event.request.formData();

			// Write all errors to form
			const fields = form.fields.map((field) => ({ ...field, errors: writable([]) }));
			for (const field of fields) writeFieldErrors(field, field.errors, formData);

			const formErrors = {} as any;

			let hasErrors = false;
			for (const field of fields) {
				const errors = get(field.errors);
				if (errors.length) {
					formErrors[field.name] = errors;
					hasErrors = true;
				}
			}

			if (hasErrors) return { __KIT_FORMS__: { [form.name]: formErrors } };

			if (actions[form.name]) {
				try {
					await actions[form.name](event, {
						formData,
						data: new Proxy(
							{},
							{
								get(target: any, prop: string) {
									if (formData.has(prop)) return formData.get(prop);
									return target[prop];
								}
							}
						)
					});
				} catch (error) {
					if (error instanceof fieldErrors) {
						return { __KIT_FORMS__: { [form.name]: { [error.field]: error.errors } } };
					}

					throw error;
				}
			}
		};
	}

	return enhancedActions;
}

/**
 * Generates a SvelteKit snapshot config for ALL the forms
 */
export function createSnapshotConfig(parsedFormConfigurations: ParsedFormConfiguration[]) {
	return undefined;
	// TODO: unfinished experimental stuff
	// const forms = parsedFormConfigurations.map(({ name, fields }) => fields);
	// const fieldValues = parsedFormConfigurations;
	// return {
	// 	capture: () => {
	// 		return fieldValues.map((value) => get(value));
	// 	},
	// 	restore: (value) => {
	// 		fieldValues.forEach((fieldValue, fieldValueIndex) =>
	// 			fieldValues[fieldValueIndex].set(value[fieldValueIndex])
	// 		);
	// 	}
	// };
}

/**
 * Helper function for generating <form ...> attributes.
 * usage: <form {...getFormElementAttributes($$props, form)}
 *
 * See Form.svelte for example of its usage.
 */
export function getFormElementAttributes(
	props: { [x: string]: any },
	parsedFormConfiguration: ParsedFormConfiguration
): object {
	const name = props.name ?? parsedFormConfiguration.name ?? 'default'; // defaults are already decided in the formConfiguration... but we check again just to be sure.
	const method = props.method ?? parsedFormConfiguration.method ?? 'POST'; // defaults are already decided in the formConfiguration... but we check again just to be sure.
	const action = props.action ?? parsedFormConfiguration.action ?? `?/${name}`;
	const id = props.id ?? parsedFormConfiguration.id ?? undefined;

	return { name, method, action, id, class: props.class };
}

export class fieldErrors {
	protected field: string;
	protected errors: string | string[];

	constructor(field: string, errors: string[]) {
		this.field = field;
		this.errors = errors;
	}
}

export function fieldError(field: string, errors: string | string[]) {
	return new fieldErrors(field, Array.isArray(errors) ? errors : [errors]);
}
