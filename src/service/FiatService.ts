import { useQuery } from 'react-query';
const axios = require('axios').default;

// const items: Record<string, number> = {
//   usd: 0.106007,
//   eur: 0.098361,
//   jpy: 13.95,
//   btc: 3.81e-6,
//   cad: 0.145292,
//   gbp: 0.08647,
// };

const getFiatPrices = async (selectedCurrency: string) => {
  selectedCurrency = selectedCurrency.toLowerCase();
  try {
    let response = axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=nav-coin&vs_currencies=${selectedCurrency}`,
    );

    response = await response.then((res: { data: any }) => {

      return res.data;
    });
    console.log(response, '......response');
    return response;
  } catch (error) {
    console.log('Failed Exchange Request: ', error);
    return error;
  }
};

const FiatRequest = (selectedCurrency: string) => {
  try {
    const query = useQuery({
      queryKey: ['fiatPrices', selectedCurrency],
      queryFn: async () => {
        const data = await getFiatPrices(selectedCurrency);
        return data;
      },
      retry: 10,
      refetchOnWindowFocus: true,
      cacheTime: 100,
      staleTime: 0,
      enabled: true,
      refetchInterval: 90000,
    });
    return query;
  } catch (error) {
    console.log('Failed Exchange Request Error : ', error);
    return error;
  }
};

export default FiatRequest;
