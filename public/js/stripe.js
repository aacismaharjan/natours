import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // https://js.stripe.com/v3/
    const stripe = Stripe(
      'pk_test_51MLgEhSAhxO87B7pgtK8ZCmaslO28CUnBrE7YmyY2zKm3drZGbQOmMT0WIaU1Gl1AUciJAy51xLbJZjU0eYEczZ500Br0rV6Oz'
    );

    // 1) Get the checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error.message);
  }
};
