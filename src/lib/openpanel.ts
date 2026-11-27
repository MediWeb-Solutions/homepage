import { OpenPanel } from '@openpanel/web';
import { browser } from '$app/environment';

export const op = browser
  ? new OpenPanel({
      clientId: '6985b93c-34cc-4f60-89a8-01f959b0225c',
      trackScreenViews: true,
      trackOutgoingLinks: true,
      apiUrl: 'http://opapi-xnq1obssn14avbdycgemnqxz.159.195.10.42.sslip.io/',
    })
  : null;