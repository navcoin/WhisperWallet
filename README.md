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

## Development

#### Screen Size

We are currently using [@tsejerome/react-native-size-matters](https://github.com/tsejerome/react-native-size-matters/). <br> The suggested default dimension screen size for UI development is 390 x 844.<br> The devices below are the suggested iPhone Simulator that matches such requirements:

- iPhone 12
- iPhone 12 Pro
- iPhone 13
- iPhone 13 Pro

References: https://www.ios-resolution.com/

## Potential Fixes

#### `Duplicate interface definition for class 'RCTModuleRegistry'`

Solution: https://github.com/LinusU/react-native-get-random-values/pull/33/commits/30267ff4e9b5e93136cc935cf0370d8a09dd3aee

#### `Command PhaseScriptExecution failed with a nonzero exit code`

Solution 1:\
Make sure your xcode npm version is using the version you set as default in your bash/zsh. e.g. if you have set a nvm default alias, you will need to check if it is the same. One quick fix is to run `nvm unalias default `

Solution 2:\
Change from your `node_modules/react-native/find-node.sh`
https://github.com/facebook/react-native/commit/35bcf934b186e581d100d43e563044300759557f
