export function cleanString(value) {
  console.log('testin the pars function');
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch (err) {
    // Ignore JSON parse errors
  }

  return value?.replace(/^"(.*)"$/, '$1');
}