import axios from '@/utils/axios';

export const fetchAllCountries = async () => {
  const { data } = await axios.get('https://www.apicountries.com/countries');
  return data;
};

export const fetchCurrencies = async () => {
  const { data } = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXPO_PUBLIC_EXCHANGE_RATE_API_KEY}/codes`,
  );

  return data;
};
