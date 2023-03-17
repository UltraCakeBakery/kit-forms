// TODO: remove the eslint disable lines
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Actions, RequestEvent } from '@sveltejs/kit';
import type {
	Configuration,
	ParsedFormConfiguration,
	ParsedFormConfigurationButton,
	ParsedFormConfigurationField
} from './types';
import { get, writable } from 'svelte/store';
import Form from './components/Form.svelte';
import FormInput from './components/FormInput.svelte';
import { regexes, messages, fieldNameToLabelConverter } from './utils';

function parseConfiguration(config: Configuration) {
	return Object.entries(config).map(([formName, formConfiguration]) => {
		return {
			name: formName,
			method: formConfiguration.method ?? 'POST',
			action: formConfiguration.action ?? `?/${formName}`,
			id: formConfiguration.id,
			component: formConfiguration.component ?? Form,
			fields: Object.entries(formConfiguration.fields || {}).map(([name, fieldConfiguration]) => {
				const field = {
					name,
					type: fieldConfiguration.type,
					placeholder: fieldConfiguration.placeholder,
					description: fieldConfiguration.description,
					options: fieldConfiguration.options,
					required: fieldConfiguration.required,
					validate: fieldConfiguration.validate,
					id: fieldConfiguration.id ?? `${formName}-${name}`,
					component: fieldConfiguration.component ?? FormInput,
					label:
						fieldConfiguration.label === undefined
							? fieldNameToLabelConverter(name)
							: fieldConfiguration.label !== null
							? fieldConfiguration.label
							: null,
					value: writable(fieldConfiguration.value ?? null),
					localErrors: writable([...((fieldConfiguration.errors as unknown as string[]) || [])]),
					serverErrors: writable([]),
					messages: { ...messages, ...(fieldConfiguration.messages || {}) }
				} as unknown as ParsedFormConfigurationField;

				field.events = {
					onInput: (event: any) => {
						event?.preventDefault();
						field.value.set(event.target.value);
						field.serverErrors.set([]);

						if (formConfiguration.errorsOnInput) writeFieldErrors(field, field.localErrors);
						else field.localErrors.set([]);
					},
					onBlur: (event: any) => {
						writeFieldErrors(field, field.localErrors);
						field.serverErrors.set([]);
					}
				};

				return field;
			}),
			buttons: Object.entries(formConfiguration.buttons || {}).map(
				([name, buttonConfiguration]) => {
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
				}
			),
			$$config: formConfiguration
		};
	}) as unknown as ParsedFormConfiguration[];
}

/**
 * Helper function that takes your config
 */
export function create(configuration: Configuration) {
	const parsedFormConfigurations = parseConfiguration(configuration);

	// We use a proxy here to make the dev experience better for the end user.
	// We basically created fancy getters, but also need to do some trickery to keep HMR support later down the line
	return new Proxy(
		{},
		{
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			get(target: { [key: string | symbol]: any }, prop) {
				if (prop === 'snapshot') return createSnapshotConfig(parsedFormConfigurations);
				if (prop === 'createActions')
					return (actions: Actions) => createActions(parsedFormConfigurations, actions);

				const parsedFormConfiguration = parsedFormConfigurations.find((form) => form.name === prop);

				if (!parsedFormConfiguration) return target[prop];

				if (typeof Form === 'object')
					return new Proxy(Form, {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						get: (target: { [key: string | symbol]: any }, prop) => {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							if (prop === 'render')
								return (props: any, { $$slots = {}, context = new Map() } = {}) => {
									return target.render(
										{ form: parsedFormConfiguration, ...props },
										{ $$slots, context }
									);
								};

							// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * this function changes the value of a field. It updates all state (validations etc).
 * You should never call this function. It is just here for advanced users who know what they are doing.
 */
export function writeFieldErrors(
	field: ParsedFormConfigurationField,
	errors: any,
	formData: FormData | undefined = undefined
) {
	if (!field.validate) return true;

	const _errors = [] as string[];
	const value = (formData ? formData.get(field.name) : get(field.value)) + '';

	for (const [validation, condition] of Object.entries(field.validate)) {
		if (
			(validation === 'isEmail' && condition === true && !regexes.email.test(value)) ||
			(validation === 'hasLength' && !value?.length) ||
			(validation === 'minLength' && value?.length < condition) ||
			(validation === 'maxLength' && value?.length > condition) ||
			(validation === 'hasLowercase' && !regexes.lowercase.test(value)) ||
			(validation === 'minLowercase' &&
				value?.replace(regexes.uppercases, '').length < condition) ||
			(validation === 'maxLowercase' &&
				value?.replace(regexes.uppercases, '').length > condition) ||
			(validation === 'hasUppercase' && !regexes.uppercase.test(value)) ||
			(validation === 'minUppercase' &&
				value?.replace(regexes.lowercases, '').length < condition) ||
			(validation === 'maxUppercase' &&
				value?.replace(regexes.lowercases, '').length > condition) ||
			(validation === 'hasNumbers' && !regexes.numbers.test(value)) ||
			(validation === 'minNumbers' && value?.replace(regexes.numbers, '').length < condition) ||
			(validation === 'maxNumbers' && value?.replace(regexes.numbers, '').length > condition) ||
			(validation === 'hasSpecial' && !regexes.special.test(value)) ||
			(validation === 'minSpecial' && value?.replace(regexes.specials, '').length < condition) ||
			(validation === 'maxSpecial' && value?.replace(regexes.specials, '').length > condition)
		)
			_errors.push(
				field.messages?.[validation]?.replaceAll('%required_amount%', condition + '') ||
					'Missing error message for ' + validation
			); // || defaultMessages.get(validation, condition, field )
	}

	errors.set(_errors);
}

/**
 * Helper function for creating magical actions for all your forms.
 */
export function createActions(
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

			if (hasErrors) return { [form.name]: formErrors };

			if (actions[form.name]) {
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
			}
		};
	}

	return enhancedActions;
}

/**
 * Create snapshot config object for all your forms
 */
export function createSnapshotConfig(parsedFormConfigurations: ParsedFormConfiguration[]) {
	return undefined;
	// return {
	//     capture: () => {
	//         // TODO: store forms and fields that are not disabled
	//     },
	//     restore: ( value: string ) => {
	//         // TODO: write fields to form
	//     }
	// }
}

/**
 * Helper function for generating <form ...> attributes.
 * usage: <form {...getFormElementAttributes($$props, form)}
 */
export function getFormElementAttributes(
	props: { [x: string]: any },
	parsedFormConfiguration: ParsedFormConfiguration
): object {
	const name = props.name ?? parsedFormConfiguration.name ?? 'default';
	const method = props.method ?? parsedFormConfiguration.method ?? 'POST';
	const action = props.action ?? parsedFormConfiguration.action ?? `?/${name}`;
	const id = props.id ?? parsedFormConfiguration.id ?? undefined;

	return { name, method, action, id, class: props.class };
}
