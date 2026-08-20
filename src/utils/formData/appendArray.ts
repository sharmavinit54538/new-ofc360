export function appendArray(formData: FormData, key: string, arr: any[]): void {
  arr.forEach((item, index) => {
    if (item instanceof File || item instanceof Blob) {
      formData.append(`${key}[${index}]`, item);
    } else if (typeof item === "object") {
      formData.append(`${key}[${index}]`, JSON.stringify(item));
    } else {
      formData.append(`${key}[${index}]`, String(item));
    }
  });
}
