import qs from 'qs';
import { Linking, Share } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getAsyncStorage, AsyncStoredItems } from './asyncStorageManager';
import { errorGroupParser } from './errors';
// import {openInbox, openComposer} from 'react-native-email-link';

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
  return { model, os, brand, systemVersion };
};

export async function sendErrorCrashEmail(particularError?: string) {
  let deviceInfo = await getDeviceInfo();
  const tempRecords: string[] = await getAsyncStorage(
    AsyncStoredItems.TEMP_ERROR_RECORDS,
  );
  const subject = 'My Whisper Wallet crashed!';
  const body = `Hello Whisper Development Team, 
My Whisper Wallet got some issues.

Here is my device info:
OS:${deviceInfo.os}
Version:${deviceInfo.systemVersion}
Brand:${deviceInfo.brand}
Model:${deviceInfo.model}


The error is as below: 
${particularError || errorGroupParser(tempRecords)}
`;
  const sendMailRes = await sendEmail('dev@whisperwallet.net', subject, body);
  if (sendMailRes.success) {
    return;
  }
  await shareErrorCrash(body);
}

export async function shareErrorCrash(errorLog: string) {
  await Share.share({
    message: errorLog,
  });
}

export async function sendEmail(
  to: Email,
  subject: string,
  body: string,
  options: EmailOptions = {},
) {
  try {
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

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return { success: false };
    }
    await Linking.openURL(url);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
