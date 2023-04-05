const API_ENDPOINT = 'http://localhost:3000';
const urlComponents = location.pathname.split('/');
const id = urlComponents[urlComponents.length - 2];

const addWatchlistButton = document.querySelector('#add-to-watchlist');
const removeWatchlistButton = document.querySelector('#remove-from-watchlist');
const posterImage = document.querySelector('#poster-image');
const genresContainer = document.querySelector('#genres');
const movieDescription = document.querySelector('#movie-description');
const movieRating = document.querySelector('#movie-rating');
const movieTrailer = document.querySelector('#movie-trailer');

renderMovie().then((res) => {
  removeWatchlistButton.addEventListener('click', async (event) => {
    const deleteResult = await deleteMovieFromWatchlist(res.id);
    if (!deleteResult.success) {
      console.log(deleteResult.message);
      return;
    }

    renderMovie();
  });

  addWatchlistButton.addEventListener('click', async (event) => {
    const result = await addMovieToWatchlist(res);
    if (!result.success) {
      console.log(result);
      return;
    }

    renderMovie();
  });
});

async function renderMovie() {
  const res = await getMovieById(id);

  if (!res.success) {
    console.log(res.message);
    return;
  }

  const watchlistedMovie = await findWatchlistById(res.data.id);

  if (watchlistedMovie.data.length) {
    addWatchlistButton.classList.add('hidden');
    removeWatchlistButton.classList.remove('invisible');
    removeWatchlistButton.classList.remove('hidden');
  } else {
    removeWatchlistButton.classList.add('hidden');
    addWatchlistButton.classList.remove('hidden');
    addWatchlistButton.classList.remove('invisible');
  }

  posterImage.src = res.data.image;
  genresContainer.innerHTML = res.data.genre.map((genre) => genreComponent(genre)).join('');
  movieDescription.innerText = res.data.synopsis;
  movieDescription.classList.add('line-clamp-5');
  movieRating.innerText = res.data.rating;
  movieTrailer.src = res.data.trailer;

  return res.data;
}

async function findWatchlistById(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/watchlist?id=${id}`);
    const data = await res.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

async function getMovieById(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/movies/${id}`);
    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function deleteMovieFromWatchlist(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/watchlist/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function addMovieToWatchlist(movie) {
  try {
    const res = await fetch(`${API_ENDPOINT}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    const data = await res.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

function genreComponent(genre) {
  return `
    <span class="block px-3 py-1 border-2 border-slate-700 rounded-full">${genre}</span>
  `;
}
