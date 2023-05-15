/* eslint-disable no-useless-escape */
const validateDate = (input) => {
  const dateRegex =
    /^(0?[1-9]|1[012])[-\/](0?[1-9]|[12][0-9]|3[01])[-\/]\d{4}$/;
  return dateRegex.test(input);
};

export default validateDate;
