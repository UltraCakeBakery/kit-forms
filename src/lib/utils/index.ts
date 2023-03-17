export { default as regexes } from './regexes';
export { default as messages } from './messages';

export function fieldNameToLabelConverter(fieldName: string) {
	let label = fieldName.replace('-', ' '); // Replace all - with spaces
	label = label.replace('_', ' '); // Replace all _ with spaces
	label = label.replace('_', ' '); // Replace all _ with spaces
	label = label.replace(/([A-Z])/g, ' $1'); // 'camelCaseText' to 'camel Case Text' converter
	label = label.charAt(0).toUpperCase() + label.slice(1); // uppercase first char
	return label;
}
