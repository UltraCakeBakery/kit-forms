/* eslint-disable no-control-regex */
export default {
	email:
		/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
	lowercase: /[a-z]/,
	lowercases: /[a-z]/g,
	uppercase: /[A-Z]/,
	uppercases: /[A-Z]/g,
	number: /[0-9]/,
	numbers: /[0-9]/g,
	special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/,
	specials: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/g,
	url: /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-]+)*\/?$/i,
	secureUrl: /^(?:https:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-]+)*\/?$/i
};

export const specials = new Set<string>('!@#$%^&*()_+-=[]{};\':"\\|,.<>/?]+'.split(''));
