import {useState} from 'react';
import {useBetween} from 'use-between';

const useWin = () => {
  const [win, setWin] = useState<any>(undefined);

  return {win, setWin};
};

export default () => useBetween(useWin);
