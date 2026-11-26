import { env } from '$env/dynamic/private';

const serviceLabels: Record<string, string> = {
  webutvikling: 'Webutvikling',
  legetjenester: 'Legetjenester',
  kursvirksomhet: 'Kurs'
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendContactAlert(message: {
  name: string;
  email: string;
  service: string | null;
  message: string;
}) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_CONTACT_EMAIL } = env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !RESEND_TO_CONTACT_EMAIL) {
    throw new Error('Contact email is not configured.');
  }

  const name = escapeHtml(message.name);
  const email = escapeHtml(message.email);
  const service = escapeHtml(serviceLabels[message.service ?? ''] ?? 'Ikke valgt');
  const content = escapeHtml(message.message).replaceAll('\n', '<br>');
  const subject = `Ny henvendelse fra nettsiden — ${service}`;
  const html =
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A1416;padding:24px 0">' +
    '<tr><td align="center"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#111C1F;border:1px solid #1E2C30;border-radius:12px;font-family:Arial,sans-serif;color:#E6ECEA">' +
    '<tr><td style="padding:28px 32px 8px"><div style="font-size:12px;color:#5FD4B4;letter-spacing:.5px">NY HENVENDELSE</div>' +
    `<h1 style="margin:8px 0 0;font-size:20px;color:#E6ECEA">${name} har sendt en melding</h1></td></tr>` +
    `<tr><td style="padding:16px 32px"><table role="presentation" width="100%" style="font-size:14px;color:#8A9A97"><tr><td style="padding:4px 0;width:90px">Navn</td><td style="color:#E6ECEA">${name}</td></tr><tr><td style="padding:4px 0">E-post</td><td><a href="mailto:${email}" style="color:#5FD4B4">${email}</a></td></tr><tr><td style="padding:4px 0">Tjeneste</td><td style="color:#E6ECEA">${service}</td></tr></table></td></tr>` +
    `<tr><td style="padding:8px 32px 24px"><div style="background:#0A1416;border:1px solid #1E2C30;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#E6ECEA">${content}</div></td></tr>` +
    `<tr><td style="padding:0 32px 28px;font-size:12px;color:#8A9A97">Svar ved å skrive til ${email}. Sendt automatisk via MediWeb Solutions sitt kontaktskjema.</td></tr></table></td></tr></table>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [RESEND_TO_CONTACT_EMAIL],
      subject,
      html,
      reply_to: message.email
    }),
    signal: AbortSignal.timeout(30_000)
  });

  const responseBody = await response.text();
  let result: unknown = null;
  if (responseBody) {
    try {
      result = JSON.parse(responseBody);
    } catch {
      if (response.ok) {
        throw new Error('Contact email provider returned an invalid response.');
      }
    }
  }
  if (!response.ok) {
    const code =
      result && typeof result === 'object' && 'name' in result && typeof result.name === 'string'
        ? result.name
        : `http_${response.status}`;
    throw new Error(`Contact email provider returned ${code}.`);
  }

  return result && typeof result === 'object' && 'id' in result && typeof result.id === 'string'
    ? result.id
    : null;
}
