import * as yup from 'yup';

// Mirrors the server rule (auth-service password_service.py):
// at least 12 characters, with an uppercase letter, a lowercase letter,
// a number and a symbol. Messages match the server's wording.
export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_HINT =
  'At least 12 characters, with an uppercase letter, a lowercase letter, a number and a symbol.';

export function newPasswordRule(requiredMessage = 'Password is required') {
  return yup
    .string()
    .required(requiredMessage)
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/, 'Password must contain at least one symbol, for example ! ? # or @')
    .max(128, 'Password must be at most 128 characters');
}
