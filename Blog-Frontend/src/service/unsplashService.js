export const fetchUnsplashImage = async (query, page = 1) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=9&client_id=DHJyVufz9Bkfe_Ppihm2-9wr1RD8OL7Mu2ifYPoZMvU`
    );

    const data = await res.json();

    return data.results.map((img) => ({
      id: img.id,
      url: img.urls.small,
      alt: img.alt_description || "Unsplash image",
    }));
  } catch (err) {
    console.error("Unsplash fetch error:", err);
    return [];
  }
};
