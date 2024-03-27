export const setDate = (calcDay: number) => {
  const date = new Date();
  date.setDate(date.getDate() + calcDay);
  return date;
};
