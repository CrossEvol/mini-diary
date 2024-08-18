import { expect, test } from "vitest";
import { type } from "./type.utils"; // Adjust the path accordingly

test('Type of null should be "null"', () => {
  expect(type(null)).toBe("null");
});

test('Type of undefined should be "undefined"', () => {
  expect(type(undefined)).toBe("undefined");
});

test('Type of a number should be "number"', () => {
  expect(type(42)).toBe("number");
});

test('Type of a boolean should be "boolean"', () => {
  expect(type(true)).toBe("boolean");
});


test('Type of a string should be "string"', () => {
  expect(type("Hello")).toBe("string");
});

test('Type of a Date should be "Date"', () => {
  expect(type(new Date())).toBe("Date");
});

test('Type of an Array should be "Array"', () => {
  expect(type([1, "b", { a: 1 }])).toBe("Array");
});

test('Type of a function should be "Function"', () => {
  expect(type(() => {})).toBe("Function");
});

test("Type of a class should be ClassName", () => {
  class DemoClass {}

  expect(type(new DemoClass())).toBe("DemoClass");
});

test('Type of a method should be "Function"', () => {
  class DemoClass {
    sayHello(){}
  }

  expect(type(new DemoClass().sayHello)).toBe("Function");
});
