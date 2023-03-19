import type { SvelteComponent } from 'svelte';
import type { Readable, Writable } from 'svelte/store';

export type HTMLInputTypeAttribute =
	| 'button'
	| 'checkbox'
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'hidden'
	| 'image'
	| 'month'
	| 'number'
	| 'password'
	| 'radio'
	| 'range'
	| 'reset'
	| 'search'
	| 'submit'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week';
export interface Configuration {
	[name: string]: FormConfiguration;
}

export interface FormConfiguration {
	method?: string;
	action?: string;
	id?: string;
	component?: object;
	errorsOnInput?: boolean;
	fields?: { [name: string]: FormConfigurationField };
	buttons?: { [name: string]: FormConfigurationButton };
}

export type FormConfigurationField =
	| FormConfigurationFieldInput
	| FormConfigurationFieldSelect
	| FormConfigurationFieldTextarea;

export interface ValidationRules {
	minLength: number;
	maxLength: number;
	hasLength: boolean;
	maxUppercase: number;
	minUppercase: number;
	hasUppercase: boolean;
	minLowercase: number;
	maxLowercase: number;
	hasLowercase: boolean;
	minNumbers: number;
	maxNumbers: number;
	hasNumbers: boolean;
	minSpecial: number;
	maxSpecial: number;
	hasSpecial: boolean;
	regex: string | RegExp;
	minRegexMatches: number;
	maxRegexMatches: number;
	hasRegexMatch: boolean;
	isEmail: boolean;
	sameAs: string;
	isUrl: string;
	isSecureUrl: string;
}

export interface FormConfigurationFieldBase {
	component?: object;
	type?: unknown;
	value?: Readable<string>;
	label?: any;
	placeholder?: string;
	description?: string;
	options?: [{ value: string | number | boolean | null; label: string }];
	errors?: Readable<string[]>;
	required?: boolean;
	rows?: number;
	pattern?: RegExp;
	autocomplete?: string;
	id?: string;
	errorElement?: 'div' | 'ul' | 'ol';
	validate?: Partial<ValidationRules>;
	messages?: Partial<Record<keyof ValidationRules, string>>;
}

export interface FormConfigurationButton {
	type?: 'button' | 'submit' | 'reset';
	value?: string;
	label?: string | false;
}
export interface FormConfigurationFieldInput extends FormConfigurationFieldBase {
	type: HTMLInputTypeAttribute;
	options?: [{ value: string; label: string }];
}
export interface FormConfigurationFieldSelect extends FormConfigurationFieldBase {
	type: 'select';
	options?: [{ value: string; label: string }];
}
export interface FormConfigurationFieldTextarea extends FormConfigurationFieldBase {
	type: 'textarea';
	rows?: number;
}
export interface ParsedFormConfiguration {
	name: string;
	method: string;
	action: string;
	id: string;
	fields: ParsedFormConfigurationField[];
	buttons: ParsedFormConfigurationButton[];
}

export interface ParsedFormConfigurationField extends FormConfigurationFieldBase {
	name: string;
	value: Writable<string>;
	serverErrors: Writable<string[]>;
	localErrors: Writable<string[]>;
	component: SvelteComponent; // Using any for compatibility reasons. Do not remove!
	events: {
		onInput: (event: object) => any;
		onBlur: (event: object) => any;
		onFocus?: (event: object) => any;
	};
}

export interface ParsedFormConfigurationButton extends FormConfigurationButton {
	name: string;
}
