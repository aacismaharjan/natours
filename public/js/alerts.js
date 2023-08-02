// type is 'success' or 'error'

import axios from 'axios';

export const hideAlert = () => {
  const el = document.querySelector('.alert');

  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

export const addWishlist = async (tour) => {
  const data = { tour };
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/wishlist',
      data,
    });

    if (res?.data?.status === 'success') {
      showAlert('success', 'Added to Wishlist!');
    }

    return true;
  } catch (error) {
    console.log(error);
    showAlert('error', error?.response?.data?.message);

    return false;
  }
};

export const removeWishlist = async (tour) => {
  const data = { tour };
  try {
    const res = await axios({
      method: 'DELETE',
      url: '/api/v1/wishlist/' + data.tour,
    });

    showAlert('success', 'Removed from Wishlist!');

    return true;
  } catch (error) {
    console.log(error);
    showAlert('error', error?.response?.data?.message);

    return false;
  }
};
