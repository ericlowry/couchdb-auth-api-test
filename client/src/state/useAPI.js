import { Provider, useFetch } from 'use-http';

const setToken = token => localStorage.setItem('accessToken', token || '');
const getToken = () => localStorage.getItem('accessToken');

export const APIProvider = ({ children }) => (
  <Provider
    url="/api"
    options={{
      cachePolicy: 'no-cache',

      interceptors: {
        request: async ({ options, url, path, route }) => {
          console.log(`${options.method} ${url}${path}${route}`);
          const token = await getToken();
          if (token) {
            console.log(`: Bearer ${token}`);
            setToken(token);
            options.headers.Authorization = `Bearer ${token}`;
          }
          return options;
        },
      },

      retries: 1,

      retryDelay: 0, // ms

      retryOn: async ({ response }) => {
        console.log(`: ${response.status}`);
        if (response.status !== 401) return false;
        const token = await getToken();
        if (!token) return false;

        const { pathname } = new URL(response.url);
        console.log(`retry: ${pathname}`);

        // attempt to get a new token...
        return fetch('/auth/token')
          .then(res => {
            if (!res.ok) throw new Error('no-token'); // don't retry
            return res.json();
          })
          .then(data => {
            console.log(`new token: ${data.token}`);
            setToken(data.token);
            return true; // retry with the new token!
          })
          .catch(() => false); // don't retry
      },
    }}
  >
    {children}
  </Provider>
);

export default useFetch;
