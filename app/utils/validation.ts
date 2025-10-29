export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;

  } catch {
    return false;
  }
};

export const isValidImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;

  return url.startsWith('http://') ||
         url.startsWith('https: //') ||
         url.startsWith('/');
};