import * as _regexes from './regexes';
import * as _consts from './consts';
import * as _messages from './messages';

export const regexes = _regexes;
export const consts = _consts;
export const messages = _messages;

export function fieldNameToLabelConverter(fieldName: string) {
	let label = fieldName.replace(/[-_]/g, ' '); // Replace all - and _ with spaces
	label = label.replace(/([A-Z])/g, ' $1'); // 'camelCaseText' to 'camel Case Text' converter
	label = label.charAt(0).toUpperCase() + label.slice(1); // uppercase first char
	return label;
}

export function countUppercaseChars(str: string): number {
	let count = 0;

	for (let i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
			count++;
		}
	}

	return count;
}

export function countLowercaseChars(str: string): number {
	let count = 0;

	for (let i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
			count++;
		}
	}

	return count;
}

export function countNumberChars(str: string): number {
	let count = 0;

	for (let i = 0; i < str.length; i++) {
		if (!Number.isNaN(Number(str.charAt(i)))) {
			count++;
		}
	}

	return count;
}
