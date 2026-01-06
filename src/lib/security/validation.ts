const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\-.\s]{7,}$/;

export const isValidEmail = (value: string) => emailRegex.test(value);

export const isValidPhone = (value: string) => phoneRegex.test(value);

export const isValidSsn = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 4 || digits.length === 9;
};

export const isValidDob = (value: string) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const year = date.getUTCFullYear();
  return year > 1900 && year <= new Date().getUTCFullYear();
};
