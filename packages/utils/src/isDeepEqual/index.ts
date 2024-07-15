export function isDeepEqual(obj1: any, obj2: any) {
  // If both objects are strictly equal, return true
  if (obj1 === obj2) {
    return true;
  }

  // Check if both objects are objects and not null
  if (typeof obj1 === "object" && obj1 !== null && typeof obj2 === "object" && obj2 !== null) {
    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, objects are not equal
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check each key recursively
    for (const key of keys1) {
      // If the key in obj1 does not exist in obj2, objects are not equal
      if (!Object.hasOwn(obj2, key)) {
        return false;
      }

      // Recursively compare nested objects
      if (!isDeepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    // If all keys and their values are equal
    return true;
  }

  // If one of the objects is not an object or is null, or if they are not equal
  return false;
}
