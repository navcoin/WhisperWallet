import {useState} from 'react';
import {useBetween} from 'use-between';

const useLockedScreen = () => {
  const [lockedScreen, setLockedScreen] = useState<boolean>(false);

  return {lockedScreen, setLockedScreen};
};

export default () => useBetween(useLockedScreen);
