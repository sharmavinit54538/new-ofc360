import { appendEntry } from "./formData/appendEntry";

export const createFormData = (object: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    appendEntry(formData, key, object[key]);
  });
  return formData;
};
