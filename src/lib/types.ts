import type { Readable, Writable } from 'svelte/store';

export type HTMLInputTypeAttribute =
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
	component?: unknown;
	errorsOnInput?: boolean;
	fields?: { [name: string]: FormConfigurationField | FormConfigurationFieldSet };
	buttons?: { [name: string]: FormConfigurationButton };
}

export type FormConfigurationFieldSet = {
	legend: string;
	fields: {
		[name: string]: FormConfigurationField;
	};
};

export type FormConfigurationField =
	| FormConfigurationFieldInput
	| FormConfigurationFieldSelect
	| FormConfigurationFieldTextarea
	| FormConfigurationFieldInputRange;

export interface ValidationRules {
	min: number;
	max: number;
	minLength: number;
	maxLength: number;
	isLength: number;
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
	minDate: Date;
	maxDate: Date;
}

export interface FormConfigurationFieldBase {
	component?: unknown;
	type?: unknown;
	value?: Readable<string>;
	label?: unknown;
	placeholder?: string;
	description?: string;
	options?: Array<{ value: string | number | boolean | null; label: string }>;
	errors?: Readable<string[]>;
	required?: boolean;
	disabled?: boolean;
	readonly?: boolean;
	hidden?: boolean;
	rows?: number;
	spellcheck?: boolean;
	minLength?: number;
	maxLength?: number;
	step?: number;
	pattern?: RegExp;
	autocomplete?: string | null;
	id?: string;
	errorElement?: 'div' | 'ul' | 'ol';
	validate?: Partial<ValidationRules>;
	messages?: Partial<Record<keyof ValidationRules | 'minTime' | 'maxTime', string>>;
}

export interface FormConfigurationButton {
	type?: 'button' | 'submit' | 'reset';
	value?: string;
	label?: string | false;
}
export interface FormConfigurationFieldInput extends FormConfigurationFieldBase {
	type: HTMLInputTypeAttribute;
	options?: Array<{ value: string; label: string }>;
}
export interface FormConfigurationFieldSelect extends FormConfigurationFieldBase {
	type: 'select';
	readonly?: never;
	step?: never;
	options?: Array<{ value: string; label: string }>;
}
export interface FormConfigurationFieldTextarea extends FormConfigurationFieldBase {
	type: 'textarea';
	step?: never;
}
export interface FormConfigurationFieldInputRange extends FormConfigurationFieldBase {
	type: 'range';
	step?: number;
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
	component: unknown; // Using any for compatibility reasons. Do not remove!
	events: {
		onInput: (event: object) => unknown;
		onBlur: (event: object) => unknown;
		onFocus?: (event: object) => unknown;
	};
}

export interface ParsedFormConfigurationButton extends FormConfigurationButton {
	name: string;
}

export interface CreatedForms {
	[form: string]: unknown;
	createActions: unknown;
	snapshots: {
		capture: unknown;
		restore: unknown;
	};
}
