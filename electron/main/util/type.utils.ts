export const type = (value: any): string => {
  if (value === null) {
    return "null";
  }
  const baseType: string = typeof value;
  // Basic types
  if (!["object", "function"].includes(baseType)) {
    return baseType;
  }

  // Symbol.toStringTag usually specifies the "display name" of the object class
  // It is used in Object.prototype.toString().
  const tag: string | undefined = value[Symbol.toStringTag];
  if (typeof tag === "string") {
    return tag;
  }

  // If it's a function and its source code starts with the "class" keyword
  if (
    baseType === "function" &&
    Function.prototype.toString.call(value).startsWith("class")
  ) {
    return "class";
  }

  // Constructor's name; for example `Array`, `GeneratorFunction`, `Number`, `String`, `Boolean`, or `MyCustomClass`
  const className: string = value.constructor.name;
  if (typeof className === "string" && className !== "") {
    return className;
  }

  // At this point, there's no appropriate way to get the type of the value, so we fall back to the basic implementation.
  return baseType;
};
