# WhisperWallet

## How to start

Tested Dev Environment

```bash
$ node --version
$ v17.6.0
$ npm --version
$ 8.5.1

```

## Development Command

Local iOS Dev: `npm run ios`
Local Android Dev: `npm run android`

## Run Locally

Clone the project

```bash
$ git clone https://github.com/aguycalled/WhisperWallet
```

Go to the project directory

```bash
$ cd WhisperWallet
```

Install dependencies

```bash
$ npm install
$ cd ios
$ pod install
```

Back to root and develop!

```bash
$ cd ..
$ npm run iOS
```

Happy Coding 🧑🏽‍💻

## Potential Fixes

#### `Duplicate interface definition for class 'RCTModuleRegistry'`

Solution: https://github.com/LinusU/react-native-get-random-values/pull/33/commits/30267ff4e9b5e93136cc935cf0370d8a09dd3aee
