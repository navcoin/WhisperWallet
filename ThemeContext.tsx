import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppTheme = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default React.createContext<AppTheme>({
  theme: 'light',
  toggleTheme: () => {},
});
