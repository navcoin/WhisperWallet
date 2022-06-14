import {useContext} from 'react';
import {SecurityContext} from '../../contexts/SecurityContext';

const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityContext');
  }
  return context;
};

export default useSecurity;
