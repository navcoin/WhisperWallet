import qs from 'qs';
import { Linking } from 'react-native';

type Email = string | string[];

type EmailOptions = {
  cc?: Email;
  bcc?: Email;
};

export async function sendErrorCrashEmail(e: Error, isFatal: boolean) {
  sendEmail(
    'tsejerome1997@gmail.com',
    'My Whisper Wallet crashed!',
    `Hello Whisper Development Team, <br>My Whisper Wallet got some issues. <br>Here is my The error is as below: <br>Error: 
    ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`,
  ).then(() => {
    console.log('Your message was successfully sent!');
  });
}
export async function sendMessageEmail(e: string) {
  sendEmail(
    'tsejerome1997@gmail.com',
    'My Whisper Wallet crashed!',
    `Hello Whisper Development Team, <br>My Whisper Wallet got some issues. <br>Here is my The error is as below: <br>Error: 
    ${e}`,
  ).then(() => {
    console.log('Your message was successfully sent!');
  });
}

export async function sendEmail(
  to: Email,
  subject: string,
  body: string,
  options: EmailOptions = {},
) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  // Create email link query
  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Provided URL can not be handled');
  }

  return Linking.openURL(url);
}
