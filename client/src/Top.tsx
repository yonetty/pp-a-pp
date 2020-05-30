import React from 'react';
import ReactDOM from 'react-dom';
import { TopPage } from './TopPage';
//import * as serviceWorker from './serviceWorker';
// i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import jaJson from './i18n/ja/top.json';
import enJson from './i18n/en/top.json';

i18n.use(initReactI18next).init({
  debug: true,
  resources: {
    en: { translation: enJson },
    ja: { translation: jaJson },
  },
  lng: 'ja',
  fallbackLng: 'ja',
  keySeparator: false,
  interpolation: { escapeValue: false },
});


ReactDOM.render(
  <React.StrictMode>
    <TopPage />
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
