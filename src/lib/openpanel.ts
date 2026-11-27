import { env } from '$env/dynamic/public';

export async function initOpenPanel() {
  const clientId = env.PUBLIC_OPENPANEL_CLIENT_ID;

  if (!clientId) {
    throw new Error('PUBLIC_OPENPANEL_CLIENT_ID is not configured.');
  }

  const { OpenPanel } = await import('@openpanel/web');

  return new OpenPanel({
    clientId,
    trackScreenViews: true,
    trackOutgoingLinks: true,
    ...(env.PUBLIC_OPENPANEL_API_URL ? { apiUrl: env.PUBLIC_OPENPANEL_API_URL } : {})
  });
}
