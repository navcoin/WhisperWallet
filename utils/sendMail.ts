import qs from 'qs';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getAsyncStorage, AsyncStoredItems } from './asyncStorageManager';
import { errorGroupParser } from './errors';

type Email = string | string[];

type EmailOptions = {
  cc?: Email;
  bcc?: Email;
};

const getDeviceInfo = async () => {
  let os = await DeviceInfo.getBaseOs();
  let brand = DeviceInfo.getBrand();
  let systemVersion = DeviceInfo.getSystemVersion();
  let model = DeviceInfo.getModel();
  return { model, os, brand, systemVersion }
}

export async function sendErrorCrashEmail(particularError?: string) {
  let deviceInfo = await getDeviceInfo();
  const tempRecords: string[] = await getAsyncStorage(AsyncStoredItems.TEMP_ERROR_RECORDS)


  await sendEmail(
    'dev@whisperwallet.net',
    'My Whisper Wallet crashed!',
    `Hello Whisper Development Team, 
    My Whisper Wallet got some issues.
    
    Here is my device info:
    OS:${deviceInfo.os}
    Version:${deviceInfo.systemVersion}
    Brand:${deviceInfo.brand}
    Model:${deviceInfo.model}
    
    
    The error is as below: 
    ${particularError || errorGroupParser(tempRecords)}
    `,
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
