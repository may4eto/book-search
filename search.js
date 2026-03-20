const formTag = document.querySelector("form");
const inputTag = formTag.querySelector("input");
const resultsTag = document.querySelector("section.results");
const title = document.querySelector("h1");

const searchGoogleBooks = function (term) {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${term}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.items) return [];
      return data.items.map((item) => {
        return {
          imageSrc: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : null,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors.toString()
            : "Unknown",
          description: item.volumeInfo.description
            ? item.volumeInfo.description.slice(0, 250) + "..."
            : "No description available",
        };
      });
    })
    .catch((error) => {
      console.error("Failed to fetch books:", error);
      return [];
    });
};

const addResults = function (items) {
  resultsTag.innerHTML = "";

  if (items.length === 0) {
    resultsTag.innerHTML = "<p>No results found. Try a different search.</p>";
    return;
  }

  items.forEach((item) => {
    const imageHTML = item.imageSrc
      ? `<img src="${item.imageSrc}" alt="${item.title}">`
      : `<div class="no-cover">No Cover</div>`;

    resultsTag.innerHTML =
      resultsTag.innerHTML +
      `
      <div class="single-result">
        <div class="image">
          ${imageHTML}
        </div>
        <h2>${item.title}</h2>
        <small>By ${item.author}</small>
        <p>${item.description}</p>
      </div>
      `;
  });
};

formTag.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTerm = inputTag.value.trim();

  if (!searchTerm) return;

  resultsTag.innerHTML = "<p>Loading...</p>";

  searchGoogleBooks(searchTerm).then((items) => {
    addResults(items);
    title.innerHTML = "Search results for: " + searchTerm;
  });

  formTag.reset();
});
