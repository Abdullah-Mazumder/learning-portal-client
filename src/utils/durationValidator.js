const validateDuration = (input) => {
  const durationRegex = /^(\d+:)?([0-5]?\d):([0-5]?\d)$/;
  const match = input.match(durationRegex);
  if (!match) {
    return false;
  }
  const hours = match[1] ? parseInt(match[1].slice(0, -1), 10) : 0;
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  if (
    hours < 0 ||
    minutes >= 60 ||
    seconds >= 60 ||
    (hours === 0 && minutes === 0 && seconds === 0)
  ) {
    return false;
  }
  return true;
};

export default validateDuration;
