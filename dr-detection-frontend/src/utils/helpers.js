export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const formatConfidence = (score) =>
  `${(score * 100).toFixed(1)}%`;

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const isValidImage = (file) => {
  const valid = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
  return valid.includes(file?.type);
};