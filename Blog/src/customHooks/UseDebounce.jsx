import { useState, useEffect } from "react";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(String(value || "")); // 👈 always string

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(String(value || ""));
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
