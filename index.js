/**
 * @format
 */

require('node-libs-react-native/globals');
//require('net');
import './shim.js';
import 'fast-text-encoding';

import {AppRegistry} from 'react-native';
import AppWrapper from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
