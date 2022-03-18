import {useState} from 'react';
import {useBetween} from 'use-between';

const useNjs = () => {
  const [njs, setNjs] = useState<any>(undefined);
  const [p2pPool, setP2pPool] = useState<any>(undefined);

  return {njs, setNjs, p2pPool, setP2pPool};
};

export default () => useBetween(useNjs);
