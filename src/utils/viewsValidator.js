const validateViews = (input) => {
  if (!input.includes(".") && !isNaN(input)) {
    return true;
  }
  const viewsRegex = /^(\d+(?:\.\d+)?k|\d+k)$/i;
  return viewsRegex.test(input);
};

export default validateViews;
