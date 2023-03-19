export { default as regexes } from './regexes';
export { default as messages } from './messages';

export function fieldNameToLabelConverter(fieldName: string) {
	let label = fieldName.replace(/[-_]/g, ' '); // Replace all - and _ with spaces
	label = label.replace(/([A-Z])/g, ' $1'); // 'camelCaseText' to 'camel Case Text' converter
	label = label.charAt(0).toUpperCase() + label.slice(1); // uppercase first char
	return label;
}
