import { describe, expect, it, test } from "vitest";
import { isValidEmail, isValidVnPhone } from "../src/regex";

const dataTest = {
  valid: {
    phone: [
      "0388888888",
      "0588888888",
      "0788888888",
      "0888888888",
      "0988888888",
      "0300000000",
      "0710000000",
    ],
    email: [
      "email@example.com",
      "firstname.lastname@example.com",
      "email@subdomain.example.com",
      "firstname+lastname@example.com",
      "firstname.lastname@example.com",
      "email@example.museum",
      "email@example.co.jp",
      "firstname-lastname@example.com",
      "1234567890@example.com",
    ],
  },
  invalid: {
    phone: [
      "01200000000",
      "01690000000",
      "01734305551",
      "09123456781123",
      "0123430555111111",
      "1234567890",
    ],
    email: [
      "email.example.com",
      "email@example@example.com",
      "email@111.222.333.44444",
      "email@example..com",
    ],
  },
};

describe("Check regex", () => {
  describe("Test valid phone", () => {
    for (const phone of dataTest.valid.phone) {
      test(`Should return true when phone is ${phone}`, () => {
        expect(isValidVnPhone(phone)).toEqual(true);
      });
    }
  });

  describe("Test invalid phone", () => {
    for (const phone of dataTest.invalid.phone) {
      test(`Should return false when phone is use ${phone}`, () => {
        expect(isValidVnPhone(phone)).toEqual(false);
      });
    }
  });

  describe("Test valid email", () => {
    for (const email of dataTest.valid.email) {
      it(`When user use ${email}`, () => {
        expect(isValidEmail(email)).toEqual(true);
      });
    }
  });

  describe("Test invalid email", () => {
    for (const email of dataTest.invalid.email) {
      it(`When user use ${email}`, () => {
        expect(isValidEmail(email)).toEqual(false);
      });
    }
  });
});
