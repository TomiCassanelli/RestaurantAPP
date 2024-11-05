export const environment = {
  production: false,
  apiURL: (typeof window !== 'undefined' && window.env && window.env.apiURL
            ? window.env.apiURL
            : 'http://localhost:5111/api'), // Valor por defecto
};