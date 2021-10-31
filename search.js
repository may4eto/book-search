const formTag = document.querySelector("form");
const inputTag = formTag.querySelector("input");
const resultsTag = document.querySelector("section.results");
const title = document.querySelector("h1");

const searchGoogleBooks = function (term) {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${term}`)
    .then((response) => response.json())
    .then((data) =>
      data.items.map((item) => {
        return {
          imageSrc: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "",
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors.toString()
            : "Unknown",
          description: item.volumeInfo.description
            ? item.volumeInfo.description.slice(0, 250) + "..."
            : "No description available",
        };
      })
    );
};

const addResults = function (items) {
  resultsTag.innerHTML = "";
  items.forEach((item) => {
    resultsTag.innerHTML =
      resultsTag.innerHTML +
      `
		<div class="single-result">
      <div class="image">
        <img src="${item.imageSrc}">
      </div>
      <h2>${item.title}</h2>
      <small>By ${item.author}</small>
			<p>${item.description}</p>
		</div>
		`;
  });
};

formTag.addEventListener("submit", function (event) {
  let searchTerm = inputTag.value;
  searchGoogleBooks(searchTerm).then((items) => {
    addResults(items);
  });
  title.innerHTML = "Search results for: " + searchTerm;
  formTag.reset;
  event.preventDefault();
});
