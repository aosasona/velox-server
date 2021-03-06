///// Filter objects /////
const obj = (object: any, ...filters: any[]) => {
  const newObject: any = {};

  Object.keys(object).forEach((key) => {
    if (filters.includes(key)) {
      newObject[key] = object[key];
    }
  });

  return newObject;
};

///// Capitalize first letter of string /////
const str = (txt: string, filter: string) => {
  switch (filter) {
    case "F":
      return txt.charAt(0).toUpperCase() + txt.slice(1).trim();
    case "L":
      return txt.charAt(txt.length - 1).toUpperCase() + txt.slice(0, -1).trim();
    default:
      return txt.toUpperCase().trim();
  }
};

const filter = {
  obj,
  str,
};

export default filter;
