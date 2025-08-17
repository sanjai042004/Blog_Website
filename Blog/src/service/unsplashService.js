export const fetchUnsplashImage = async (query) => {

  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=9&client_id=DHJyVufz9Bkfe_Ppihm2-9wr1RD8OL7Mu2ifYPoZMvU`);
    const data = await res.json();
    return data.results.map((img) => img.urls.small);
  } catch (err) {
    console.error("Unsplash fetch error:", err);
    return [];
  }
};
