import React from 'react';
import ReactDOM from 'react-dom';
import { JoinPage } from './JoinPage';
//import * as serviceWorker from './serviceWorker';
// i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import jaJson from './i18n/ja/join.json';
import enJson from './i18n/en/join.json';

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

declare var joinProps: any;

ReactDOM.render(
  <React.StrictMode>
    <JoinPage {...joinProps} />
  </React.StrictMode>,
  document.getElementById('app')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
