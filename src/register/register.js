const API_ENDPOINT = 'http://localhost:3000';

const formRegister = document.querySelector('#form-register');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#password-confirmation');
const buttonSubmit = document.querySelector('button[type="submit"]');

const toastElement = document.querySelector('#toast');

formRegister.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (usernameInput.value.includes(' ')) {
    showToast('error', "Username can't includes whitespace");
    return;
  }

  if (
    !usernameInput.value.length ||
    !emailInput.value.length ||
    !passwordInput.value.length ||
    !passwordConfirmInput.value
  ) {
    showToast('error', "Fields can't be empty!");
    return;
  }

  if (passwordInput.value !== passwordConfirmInput.value) {
    showToast('erorr', "Passwords don't match. Please try again");
    return;
  }

  const userWithUsername = await findUser('username', usernameInput.value);
  const userWithEmail = await findUser('email', emailInput.value);
  if (userWithUsername.data.length > 0 || userWithEmail.data.length > 0) {
    showToast('error', 'Username or email already used');
    return;
  }

  const userObject = makeUserObject(usernameInput, emailInput, passwordInput);
  const res = await createUser(userObject);

  if (!res.success) {
    showToast('error', 'Error creating user: ' + res.message);
    return;
  }

  clearAllInputs();
  showToast('success', `Username ${res.data.username} successfully created!`);

  setTimeout(() => {
    location.pathname = 'login/';
  }, 2000);
});

async function createUser(user) {
  try {
    const res = await fetch(`${API_ENDPOINT}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
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

async function findUser(field, username) {
  try {
    const res = await fetch(`http://localhost:3000/users?${field}=${username}`);
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

function makeUserObject(usernameInput, emailInput, passwordInput) {
  return {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };
}

function clearAllInputs() {
  usernameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
  passwordConfirmInput.value = '';
}

function showToast(status, message) {
  if (toast.classList.contains('-translate-y-60')) {
    if (status === 'success') {
      toast.children[0].src = '../assets/icon-check.svg';
      toast.children[2].classList.add('text-green-700');
      toast.classList.add('bg-green-400', 'ring-green-700');
    } else {
      toast.children[0].src = '../assets/icon-x.svg';
      toast.children[2].classList.add('text-red-700');
      toast.classList.add('bg-red-400', 'ring-red-700');

      setTimeout(() => {
        toast.classList.replace('-translate-y-0', '-translate-y-60');
      }, 2000);
    }
    toast.children[2].innerText = message;
    toast.classList.remove('invisible');
    toast.classList.replace('-translate-y-60', '-translate-y-0');
  }
}
