import { Images } from '../assets/images';
import { NetworkOption, ServerOption } from './Type';

export const OnBoarding = [
  {
    id: 0,
    image: Images.logo,
    color: '#215190',
    aspectRatio: 1,
    title: 'Whisper Wallet',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis risus eu sapien dictum, nec sollicitudin metus placerat. Nam eget eros aliquet, laoreet eros quis, congue dolor. ',
  },
  {
    id: 1,
    color: '#4B9BAE',
    image: Images.xNavLogo,
    aspectRatio: 1,
    title: 'Keep your finances secret.',
    description:
      'Morbi semper nibh vulputate, consectetur risus eu, eleifend sapien. Etiam posuere maximus elementum. Vestibulum ipsum metus, mollis vitae tincidunt at, molestie et ipsum. ',
  },
  {
    id: 2,
    color: '#333333',
    image: Images.navLogo,
    aspectRatio: 1,
    title: 'Encrypted, secure.',
    description:
      'Sed eget viverra mi, non placerat risus. Aliquam vel felis eget nunc condimentum hendrerit. Fusce feugiat, nibh suscipit pharetra tempor, risus nulla euismod ante, sit amet rhoncus odio urna ac lorem. Cras elit erat, lacinia vel malesuada vel, cursus eu odio. ',
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
