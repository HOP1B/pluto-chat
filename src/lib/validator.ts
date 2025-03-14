/**
 * Checks if the given string isn't voilating any of the password rules
 * ! ADD A TRY CATCH BLOCK IF USING
 * * Throw's an error when it's an invalid password and use the sent error.
 * @param password A string to be checked
 *
 * @example
 * ```typescript
 * try {
 *   validatePassword(password);
 * } catch(err) {
 *   console.log(GetErrorMessage(err));
 * }
 * ```
 */
export function validatePassword(password: string) {
  if (password.length < 8) {
    throw new Error("Password's must be atleast 8 characters long");
  }
  if (password.length > 100) {
    throw new Error("Password's must be shorter than 100 characters");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password must contain 1 number");
  }
}

const EMAILREGEX =
  /^[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-z0-9](?:[A-z0-9-]*[A-z0-9])?\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?$/;
/**
 * Check's whether a given string is a valid email
 * I think I ripped this from ripexpr (?)
 * @param email A string that is either an email or not
 * @returns Whether the given string is an email or not
 */
export function checkIfEmail(email: string): boolean {
  return EMAILREGEX.test(email);
}

const PHONEREGEX = /^\d{8}$/g;
/**
 * Check's whether a given string is a valid phone number
 * Currently it only checks if there is a 8 consecutive digits
 * @param pnum A string that maybe is an phone number
 * @returns Whether the string is a phone number or not
 */
export function checkIfPhone(pnum: string): boolean {
  return PHONEREGEX.test(pnum);
}

const USERNAMEREGEX = /^([A-z]|[0-9]|_|\.){3,20}$/g;
/**
 * Check's whether a given string is a valid username.
 * Rules:
 * - Username must be between 3 to 20
 * - Only letters (a -> z and A -> Z), numbers (0 -> 9), underscores (_) and periods (.)
 * @param username The username that is checked
 * @returns Whether the username is valid or not
 */
export function checkIfValidUsername(username: string): boolean {
  return USERNAMEREGEX.test(username);
}
