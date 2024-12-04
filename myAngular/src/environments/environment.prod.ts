export const environment = {
  production: true,
  apiURL: (typeof window !== 'undefined' && window.env && window.env.apiURL
            ? window.env.apiURL
            : 'http://localhost:5111/api'), // Valor por defecto
};
