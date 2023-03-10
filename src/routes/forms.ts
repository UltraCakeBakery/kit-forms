import { create } from '$lib/index'

export default create(
    {
        register: {
            fields: {
                email: {
                    type: 'email',
                    placeholder: 'john.doe@example.com',
                    required: true,
                    validate: { 
                        isEmail: true
                    }
                },
                password: {
                    type: 'password',
                    placeholder: '************',
                    description: 'Pick a safe and secure password that has a minimum length of 8 characters, and includes atleast one uppercase, lowercase, number and special character.',
                    required: true,
                    validate: {
                        minLength: 8,
                        hasUppercase: true,
                        hasLowercase: true,
                        hasNumbers: true
                    }
                },
                'repeat-password': {
                    type: 'password',
                    placeholder: '************',
                    description: 'To make sure you typed your password correctly, please repeat it again here.',
                    required: true,
                    validate: {
                        sameAs: 'password'
                    }
                }
            }
        },
        login: {
            fields: {
                email: {
                    type: 'email',
                    placeholder: 'john.doe@example.com',
                    validate: {
                        isEmail: true
                    }
                },
                password: {
                    type: 'password',
                    placeholder: '************',
                    validate: {
                        minLength: 5,
                        maxLength: 255,
                        hasLength: true,
                        minUppercase: 0,
                        maxUppercase: 10,
                        hasUppercase: true,
                        minLowercase: 0,
                        maxLowercase: 10,
                        hasLowercase: true,
                        minNumbers: 0,
                        maxNumbers: 10,
                        hasNumbers: true,
                        minSpecial: 0,
                        maxSpecial: 10,
                        hasSpecial: true,
                        minRegexMatches: 0,
                        maxRegexMatches: 10,
                        hasRegexMatch: true,
                    },
                    messages: {
                        minLength: 'Your password may not be smaller than %required_amount% characters',
                        maxLength: 'Your password may not be smaller than %required_amount% characters',
                    }
                },
                'remember-me': {
                    type: 'checkbox'
                }
            },
            buttons: {
                submit: {
                    
                }
            }
        }
    }
)