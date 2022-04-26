import qs from 'qs';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';

type Email = string | string[];

type EmailOptions = {
  cc?: Email;
  bcc?: Email;
};

const getDeviceInfo = () => {
  let os = DeviceInfo.getBaseOs();
  let brand = DeviceInfo.getBrand();
  let systemVersion = DeviceInfo.getSystemVersion();
  let model = DeviceInfo.getModel();
  return { model, os, brand, systemVersion }
}

export async function sendErrorCrashEmail(
  e: Error | string,
  isFatal: boolean = true,
) {
  let error = typeof e === 'string' ? e : `${e.name} ${e.message}`;
  let deviceInfo = getDeviceInfo();
  sendEmail(
    'dev@whisperwallet.net',
    'My Whisper Wallet crashed!',
    `Hello Whisper Development Team, <br>My Whisper Wallet got some issues. <br><br>Here is my device info:<br>OS:${deviceInfo.os}<br>Version:${deviceInfo.systemVersion}<br>Brand:${deviceInfo.brand}<br>Model:${deviceInfo.model}<br><br><br>.The error is as below: <br>Error: 
    ${isFatal ? 'Fatal:' : ''} ${error}`,
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
