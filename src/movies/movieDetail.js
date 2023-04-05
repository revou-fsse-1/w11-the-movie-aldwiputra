const API_ENDPOINT = 'http://localhost:3000';
const urlComponents = location.pathname.split('/');
const id = urlComponents[urlComponents.length - 2];

const addWatchlistButton = document.querySelector('#add-to-watchlist');
const posterImage = document.querySelector('#poster-image');
const genresContainer = document.querySelector('#genres');
const movieDescription = document.querySelector('#movie-description');
const movieRating = document.querySelector('#movie-rating');
const movieTrailer = document.querySelector('#movie-trailer');

renderMovie();

async function renderMovie() {
  const res = await getMovieById(id);

  if (!res.success) {
    console.log(res.message);
    return;
  }

  posterImage.src = res.data.image;
  genresContainer.innerHTML = res.data.genre.map((genre) => genreComponent(genre)).join('');
  movieDescription.innerText = res.data.synopsis;
  movieDescription.classList.add('line-clamp-6');
  movieRating.innerText = res.data.rating;
  movieTrailer.src = res.data.trailer;
}

async function getMovieById(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/movies/${id}`);
    const data = await res.json();

    console.log(data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

function genreComponent(genre) {
  return `
    <span class="block px-3 py-1 border-2 border-slate-700 rounded-full">${genre}</span>
  `;
}
