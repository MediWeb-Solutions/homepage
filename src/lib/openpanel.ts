import { OpenPanel } from '@openpanel/web';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

export const op = browser
  ? new OpenPanel({
      clientId: env.PUBLIC_OPENPANEL_CLIENT_ID,
      trackScreenViews: true,
      trackOutgoingLinks: true,
      apiUrl: env.PUBLIC_OPENPANEL_API_URL,
    })
  : null;