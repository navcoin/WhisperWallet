import {useQuery} from 'react-query';
const axios = require('axios').default;

// const items: Record<string, number> = {
//   usd: 0.106007,
//   eur: 0.098361,
//   jpy: 13.95,
//   btc: 3.81e-6,
//   cad: 0.145292,
//   gbp: 0.08647,
// };

const getFiatPrices = async () => {
  try {
    let response = axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=nav-coin&vs_currencies=usd,btc,eur,jpy,cad,gbp',
    );

    response = await response.then((res: {data: any}) => {
      return res.data;
    });

    return response;
  } catch (error) {
    return error;
  }
};

const FiatRequest = () => {
  try {
    const query = useQuery('fiatPrices', getFiatPrices, {
      retry: 10,
      refetchOnWindowFocus: true,
      cacheTime: 100,
      staleTime: 0,
      enabled: true,
    });
    return query;
  } catch (error) {
    return error;
  }
};

export default FiatRequest;
