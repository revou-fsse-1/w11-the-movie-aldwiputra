const API_ENDPOINT = 'http://localhost:3030';

const formLogin = document.querySelector('#form-register');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const buttonSubmit = document.querySelector('button[type="submit"]');

const toastElement = document.querySelector('#toast');

const user = localStorage.getItem('loggedInUser');
if (user) {
  location.pathname = '/';
}

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!usernameInput.value.length || !passwordInput.value.length) {
    showToast('error', "Fields can't be empty!");
    return;
  }

  const userResult = await findUser(usernameInput.value);
  if (!userResult.success) {
    showToast('error', 'Server error. Please turn on the json-server');
    return;
  }

  const isValid =
    userResult.data[0]?.username === usernameInput.value &&
    userResult.data[0]?.password === passwordInput.value;

  if (!isValid) {
    showToast('error', 'Invalid username or password. Please try again.');
  } else {
    showToast('success', 'Login success. Redirecting now...');
    setTimeout(() => {
      localStorage.setItem('loggedInUser', usernameInput.value);
      cleanAllInputs();
      window.location.pathname = '/';
    }, 2000);
  }
});

async function findUser(username) {
  try {
    const res = await fetch(`http://localhost:3000/users?username=${username}`);
    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

function cleanAllInputs() {
  usernameInput.value = '';
  passwordInput.value = '';
}

function showToast(status, message) {
  if (toast.classList.contains('-translate-y-60')) {
    if (status === 'success') {
      toast.children[0].src = '../assets/icon-check.svg';
      if (toast.classList.contains('bg-red-400')) {
        toast.children[2].classList.replace('text-red-700', 'text-green-700');
        toast.classList.replace('bg-red-400', 'bg-green-400');
        toast.classList.replace('ring-red-700', 'ring-green-700');
      } else {
        toast.children[2].classList.add('text-green-700');
        toast.classList.add('bg-green-400', 'ring-green-700');
      }
    } else {
      toast.children[0].src = '../assets/icon-x.svg';
      toast.children[2].classList.add('text-red-700');
      toast.classList.add('bg-red-400', 'ring-red-700');
    }
    toast.children[2].innerText = message;
    toast.classList.remove('invisible');
    toast.classList.replace('-translate-y-60', '-translate-y-0');

    setTimeout(() => {
      toast.classList.replace('-translate-y-0', '-translate-y-60');
    }, 2000);
  }
}
