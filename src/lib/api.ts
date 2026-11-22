import { browser } from '$app/environment';
import { createAuthClient } from 'better-auth/svelte';
import { writable } from 'svelte/store';

type User = { id: string; name: string; email: string };

export const authClient = createAuthClient();
export const auth = writable<{ user: User | null }>({ user: null });
export const authReady = browser
  ? authClient
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          throw new Error(error.message);
        }
        auth.set({ user: data?.user ?? null });
      })
      .catch((cause: unknown) => {
        console.error('Could not restore the authentication session.', cause);
      })
  : Promise.resolve();

export async function api(
  path: string,
  { method = 'GET', body }: { method?: string; body?: unknown } = {}
) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || data.message || `HTTP ${res.status}`);
  }
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const { data, error } = await authClient.signUp.email({ name, email, password });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Klarte ikke å opprette konto.');
  auth.set({ user: data.user });
  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({ email, password });
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Klarte ikke å logge inn.');
  auth.set({ user: data.user });
  return data;
}

export async function logout() {
  const { error } = await authClient.signOut();
  if (error) throw new Error(error.message);
  auth.set({ user: null });
}

