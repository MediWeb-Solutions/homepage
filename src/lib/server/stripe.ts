import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required for payment operations.');
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}
