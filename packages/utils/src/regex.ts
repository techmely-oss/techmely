/**
 * @description The best answer from stack overflow
 * @link https://stackoverflow.com/a/46181
 */
export const emailRegex = new RegExp(
  /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z-]+\.)+[A-Za-z]{2,}))$/,
);
export const isValidEmail = (email: string) => emailRegex.test(email);

/**
 * @description Before September 15 2018, Vietnam has phone number start with 0 and have exact 10 chars.
 */
export const vietnamPhoneRegex = new RegExp(/^0(\d{9})$/);
export const isValidVnPhone = (phone: string) => vietnamPhoneRegex.test(phone);

export const urlRegex =
  /(((^https?:(?:\/\/)?)(?:[\w$&+,:;=-]+@)?[\d.A-Za-z-]+(?::\d+)?|(?:www.|[\w$&+,:;=-]+@)[\d.A-Za-z-]+)((?:\/[\w%+./~-]*)?\??[\w%&+.;=@-]*(?:#\w*)?)?)$/;
export const isValidUrl = (path: string) => urlRegex.test(path);

export const multilineCommentsRegex = /\/\*(.|[\r\n])*?\*\//gm;
export const singlelineCommentsRegex = /\/\/.*/g;
export const escapedSpaceCharactersRegex = /( |\\t|\\n|\\f|\\r)+/g;
