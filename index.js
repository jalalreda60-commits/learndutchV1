// index.js — App entry point
// Required when NOT using expo-router (file-based routing).
// The package.json "main" field points here.
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately.
registerRootComponent(App);
