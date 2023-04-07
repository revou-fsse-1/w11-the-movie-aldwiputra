const API_ENDPOINT = 'http://localhost:3030';

const main = document.querySelector('#main-content');
const flexWrapper = document.querySelector('#flex-wrapper');
const watchlistLinkButton = document.querySelector('#watchlist-link');
const user = localStorage.getItem('loggedInUser');

if (!user) {
  watchlistLinkButton.classList.add('invisible');
  main.classList.remove('invisible');

  main.innerHTML = `
    <div class="w-fit mx-auto text-center flex flex-col items-center">
      <h1 class="text-3xl text-center font-semibold mt-24 text-slate-700">You're not logged in. Redirecting now...</h1>
      <img src="./assets/illustration-lock.png" alt="unlock illustration" class="text-center mt-12 -translate-x-8"/>
    </div>
  `;

  setTimeout(() => {
    window.location.pathname = '/login';
  }, 2000);
}

getWatchlist().then((result) => {
  if (!result.success) {
    main.innerHTML = `
      <div class="w-fit mx-auto text-center flex flex-col items-center">
        <h1 class="text-4xl text-center font-semibold mt-12 text-slate-700">Failed fetching the data</h1>
        <p class="mt-2 text-slate-500">Make sure that you have run the the <b>json-server</b></p>
        <img src="../assets/illustration-error.svg" alt="unlock illustration" class="text-center w-full max-w-[15rem] mt-12"/>
      </div>
    `;
    return;
  }

  if (!result.data.length) {
    main.innerHTML = `
      <div class="w-fit mx-auto text-center flex flex-col items-center">
        <h1 class="text-4xl text-center font-semibold mt-12 text-slate-700">Your watchlist is empty</h1>
        <p class="mt-2 text-slate-500">Start <strong>adding</strong> movies to the watchlist now!</p>
        <img src="../assets/illustration-empty.svg" alt="unlock illustration" class="text-center w-[55rem] max-w-full"/>
      </div>
    `;
    return;
  }

  const movieComponentsHolder = [];
  result.data.forEach((movie) => {
    movieComponentsHolder.push(movieComponent(movie));
  });

  flexWrapper.innerHTML = movieComponentsHolder.join('');
});

async function getWatchlist() {
  try {
    const res = await fetch(`${API_ENDPOINT}/watchlist`);
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

function movieComponent(data) {
  return `
    <a
      href="/movies/${data.id}"
      class="group relative max-w-[10rem] aspect-[2/3] shrink-0 w-[10rem] rounded-xl overflow-hidden bg-zinc-700">
      <img
        class="w-full h-full"
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
