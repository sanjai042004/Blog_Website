export const calculateReadTime=(text)=> {
  const wordsPerMinute = 200; 
  const words = text?.trim().split(/\s+/).length || 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
