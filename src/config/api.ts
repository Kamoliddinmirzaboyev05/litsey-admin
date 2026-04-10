export const API_BASE_URL = "https://academiklitsey.pythonanywhere.com";

export const getImageUrl = (path: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Ensure the path starts with /
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${formattedPath}`;
};
