import '@babel/polyfill';
import { login, logout, signup } from './login';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';
import { addWishlist, removeWishlist } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const updateUserForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logOutBtn = document.querySelectorAll('.nav__el--logout');

const bookBtn = document.getElementById('book-tour');

const cards = document.querySelectorAll('.tour-card');
Array.from(cards).map((card) => {
  const addBtn = card.querySelector('.btn-add-wishlist');
  const removeBtn = card.querySelector('.btn-remove-wishlist');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const tourId = JSON.parse(card.dataset.tour);
      if (await addWishlist(tourId)) {
        addBtn.classList.add('hide');
        removeBtn.classList.remove('hide');
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', async () => {
      const tourId = JSON.parse(card.dataset.tour);
      if (await removeWishlist(tourId)) {
        addBtn.classList.remove('hide');
        removeBtn.classList.add('hide');
      }
    });
  }
});

// DELEGATION
if (mapBox) {
  var myLocations = JSON.parse(mapBox.dataset.locations);
  displayMap(myLocations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const actionBtn = document.querySelector("button[type='submit']");

    e.preventDefault();

    const data = { email, password };

    actionBtn.disabled = true;

    e.preventDefault();

    await login(data);

    actionBtn.disabled = false;
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const actionBtn = document.querySelector("button[type='submit']");

    actionBtn.disabled = true;
    actionBtn.innerText = 'Creating Your Account...';
    e.preventDefault();
    const data = { name, email, password, passwordConfirm };

    await signup(data);
    actionBtn.disabled = false;
    actionBtn.innerText = 'Signup';
  });
}

if (logOutBtn) {
  logOutBtn.forEach((btn) => btn.addEventListener('click', logout));
  // console.log(logOutBtn);
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    e.preventDefault();
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    document.querySelector('.btn--save-password').textContent = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

// Navigation
const navBtn = document.querySelector('#navBtn');
const navList = document.querySelector('.nav-links');

if (navBtn) {
  navBtn.addEventListener('click', (e) => {
    if (navList.style.display === 'block') {
      navList.style.display = 'none';
    } else {
      navList.style.display = 'block';
    }
  });
}

// Global image error handler
const recentProfileList = document.querySelectorAll('img');

Array.from(recentProfileList).map((item) => {
  item.addEventListener('error', (img) => {
    img.target.src = '/img/favicon.png';
  });
});
