function addZeroz(number) {
  return ("0" + number).slice(-2);
}

export const getCorrectDate = (date) => {
  const timezonDate = new Date(date);
  const year = timezonDate.getFullYear();
  const month = addZeroz(timezonDate.getMonth() + 1);
  const day = addZeroz(timezonDate.getDate());
  return `${day}.${month}.${year}`;
};

export const getCorrectTime = (date) => {
  const timezonDate = new Date(date);
  const hours = addZeroz(timezonDate.getHours());
  const minutes = addZeroz(timezonDate.getMinutes());
  return `${hours}:${minutes}`;
};
