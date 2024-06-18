export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
