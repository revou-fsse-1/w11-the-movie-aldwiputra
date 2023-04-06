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
    removeWatchlistButton.disabled = true;
    addWatchlistButton.disabled = true;

    const deleteResult = await deleteMovieFromWatchlist(res.id);
    if (!deleteResult.success) {
      console.log(deleteResult.message);
      return;
    }

    showToast('success', 'Movie <strong>removed</strong> from watchlist');
    renderMovie();
    setTimeout(() => {
      removeWatchlistButton.disabled = false;
      addWatchlistButton.disabled = false;
    }, 2000);
  });

  addWatchlistButton.addEventListener('click', async (event) => {
    addWatchlistButton.disabled = true;
    removeWatchlistButton.disabled = true;

    const result = await addMovieToWatchlist(res);
    if (!result.success) {
      console.log(result);
      return;
    }

    showToast('success', 'Movie <strong>added</strong> to watchlist');
    renderMovie();
    setTimeout(() => {
      addWatchlistButton.disabled = false;
      removeWatchlistButton.disabled = false;
    }, 2000);
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

function showToast(status, message) {
  if (toast.classList.contains('-translate-y-60')) {
    if (status === 'success') {
      toast.children[0].src = '../../assets/icon-check.svg';
      if (toast.classList.contains('bg-red-400')) {
        toast.children[2].classList.replace('text-red-700', 'text-green-700');
        toast.classList.replace('bg-red-400', 'bg-green-400');
        toast.classList.replace('ring-red-700', 'ring-green-700');
      } else {
        toast.children[2].classList.add('text-green-700');
        toast.classList.add('bg-green-400', 'ring-green-700');
      }
    } else {
      toast.children[0].src = '../../assets/icon-x.svg';
      toast.children[2].classList.add('text-red-700');
      toast.classList.add('bg-red-400', 'ring-red-700');
    }
    toast.children[2].innerHTML = message;
    toast.classList.remove('invisible');
    toast.classList.replace('-translate-y-60', '-translate-y-0');

    setTimeout(() => {
      toast.classList.replace('-translate-y-0', '-translate-y-60');
    }, 2000);
  }
}
