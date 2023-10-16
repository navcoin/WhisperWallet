import { Images } from '@images';
import { NetworkOption, ServerOption } from './Type';

export const OnBoarding = [
  {
    id: 0,
    image: Images.navLogo,
    color: '#A98BBD',
    aspectRatio: 1,
    title: 'Whisper Wallet',
    description:
      "Whisper Wallet is a privacy-preserving wallet for your mobile phone. Store, transfer and stake your coins using Navcoin's self-developed technology.",
  },
  {
    id: 1,
    color: '#61BAAD',
    image: Images.xNavLogo,
    aspectRatio: 1,
    title: 'Privacy for everyone',
    description:
      'Enjoy the convenience of having separated public and private accounts. Easily transfer between accounts to protect your privacy.',
  },
  {
    id: 2,
    color: '#61BAAD',
    bgColor: '#61BAAD',
    image: Images.chicken,
    aspectRatio: 2,
    title: 'Earn with cold staking',
    description:
      'Delegate your coins to a staking pool or your own Navcoin full node and earn up to 8% per year.',
  },
];

export const protosOptions = ['tcp', 'ssl', 'ws', 'wss'];

export const networkOptions: {
  [key in NetworkOption]: ServerOption[];
} = {
  testnet: [
    {
      host: 'electrum-testnet2.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'testnet',
    },
    {
      host: 'electrum-testnet.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'testnet',
    },
  ],
  mainnet: [
    {
      host: 'electrum4.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'mainnet',
    },
    {
      host: 'electrum.nextwallet.org',
      port: 40004,
      proto: 'wss',
      type: 'mainnet',
    },
    {
      host: 'electrum2.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'mainnet',
    },
    {
      host: 'electrum3.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'mainnet',
    },
    {
      host: 'electrum.nav.community',
      port: 40004,
      proto: 'wss',
      type: 'mainnet',
    },
  ],
};
