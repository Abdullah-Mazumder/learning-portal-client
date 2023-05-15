/* eslint-disable no-useless-escape */
const validateURL = (input) => {
  const urlRegex =
    /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?$/;
  return urlRegex.test(input);
};

export default validateURL;
