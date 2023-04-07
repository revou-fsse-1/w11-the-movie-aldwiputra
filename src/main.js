const API_ENDPOINT = 'http://localhost:3030';

const currentlyWatchingContainer = document.querySelector('#currently-watching-list');
const suggestedWatchContainer = document.querySelector('#suggested-watch-list');
const previouslyWatchedContainer = document.querySelector('#previously-watched-list');

const main = document.querySelector('#main-content');
const watchlistLinkButton = document.querySelector('#watchlist-link');
const user = localStorage.getItem('loggedInUser');

if (!user) {
  watchlistLinkButton.classList.add('invisible');

  main.innerHTML = `
    <div class="w-fit mx-auto text-center flex flex-col items-center">
      <h1 class="text-3xl text-center font-semibold mt-12 text-slate-700">You're not logged in. Redirecting now...</h1>
      <img src="./assets/illustration-lock.png" alt="unlock illustration" class="text-center mt-12 -translate-x-8"/>
    </div>
  `;

  setTimeout(() => {
    window.location.pathname = '/login';
  }, 2000);
}

renderAllMovies();

async function renderAllMovies() {
  const res = await getAllMovies();

  if (!res.success) {
    main.innerHTML = `
      <div class="w-fit mx-auto text-center flex flex-col items-center">
        <h1 class="text-4xl text-center font-semibold mt-12 text-slate-700">Failed fetching the data</h1>
        <p class="mt-2 text-slate-500">Make sure that you have run the the <b>json-server</b></p>
        <img src="./assets/illustration-error.svg" alt="unlock illustration" class="text-center w-full max-w-[15rem] mt-12"/>
      </div>
  `;
    return;
  }

  for (const category in res.data) {
    const components = [];

    res.data[category].forEach((movie) => {
      components.push(movieComponent(movie));
    });

    switch (category) {
      case 'currentWatch':
        currentlyWatchingContainer.innerHTML = components.join('');
        break;
      case 'isSuggested':
        suggestedWatchContainer.innerHTML = components.join('');
        break;
      case 'isPrevious':
        previouslyWatchedContainer.innerHTML = components.join('');
        break;
    }
  }
}

async function getAllMovies() {
  try {
    const res = await Promise.all([
      fetch(`${API_ENDPOINT}/currentWatch`),
      fetch(`${API_ENDPOINT}/isSuggested`),
      fetch(`${API_ENDPOINT}/isPrevious`),
    ]);

    const currentWatch = await res[0].json();
    const isSuggested = await res[1].json();
    const isPrevious = await res[2].json();

    return {
      success: true,
      data: {
        currentWatch,
        isSuggested,
        isPrevious,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
}

function movieComponent(data) {
  return `
    <a
      href="/movies/${data.id}"
      class="group relative max-w-[8.5rem] shrink-0 w-[8.5rem] rounded-xl overflow-hidden bg-zinc-700">
      <img
        class="w-full aspect-[2/3]"
        src="${data.image}" />
      <div
        class="absolute inset-0 pointer-events-none flex justify-center transition-opacity duration-200 items-center bg-sky-600/80 opacity-0 group-hover:opacity-100">
        <div
          class="text-sm font-medium text-slate-200 border-[1.5px] border-slate-200 px-2 py-1 rounded-lg">
          <span>Details</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="h-[1em] inline-block">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
      </div>
  </a>
  `;
}
