/**
 * Password validation
 * ! ADD A TRY CATCH BLOCK IF USING
 * * Throw's an error when it's an invalid password and use the sent error.
 * @param password string
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
 * @param email string
 * @returns bool
 */
export function checkIfEmail(email: string) {
  return EMAILREGEX.test(email);
}

const PHONEREGEX = /^\d{8}$/g;
/**
 * Check's whether a given string is a valid phone number
 * @param pnum string
 * @returns bool
 */
export function checkIfPhone(pnum: string) {
  return PHONEREGEX.test(pnum);
}