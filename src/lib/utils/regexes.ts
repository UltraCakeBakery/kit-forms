/* eslint-disable no-control-regex */
export const email =
	/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
export const lowercase = /[a-z]/;
export const lowercases = /[a-z]/g;
export const uppercase = /[A-Z]/;
export const uppercases = /[A-Z]/g;
export const number = /[0-9]/;
export const numbers = /[0-9]/g;
export const special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
export const specials = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/g;
export const url = /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-]+)*\/?$/i;
export const secureUrl = /^(?:https:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-]+)*\/?$/i;
