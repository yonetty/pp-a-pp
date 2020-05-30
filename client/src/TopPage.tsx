import React, { FunctionComponent, useState, useEffect } from "react";
import { LanugageSelector } from "./LanguageSelector";
import { useTranslation } from 'react-i18next';

export const TopPage: FunctionComponent = () => {
  const [t, i18n] = useTranslation();
  const languages = [{ code: "ja", name: "Japanese" }, { code: "en", name: "English" }];
  const [currentLang, setCurrentLang] = useState("ja");
  // Change language of i18n
  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);
  // Handler
  const handleLanguageSelectionChange = (lang: string) => {
    setCurrentLang(lang);
  }
  return (
    <>
      <header className="header">
        <h1 className="title">{t('title')}</h1>
        <p className="description">
          {t('message.desc1')}<br />
          {t('message.desc2')}
        </p>
        <LanugageSelector languages={languages} selectedLanguage={currentLang} onLanguageSelectionChange={handleLanguageSelectionChange} />
      </header>
      <main>
        <form className="openForm" action="/table/open" method="POST">
          <input name="tablename" type="text" required placeholder={t('placeholder.tablename')} />
          <input name="nickname" type="text" required placeholder={t('placeholder.nickname')} />
          <select name="decktype" defaultValue="" required>
            <option value="">{t('option.decktype.default')}</option>
            <option value="int">{t('option.decktype.int')}</option>
            <option value="half">{t('option.decktype.half')}</option>
            <option value="fibo">{t('option.decktype.fibo')}</option>
          </select>
          <input type="submit" value={t('button.opentable').toString()} />
        </form>
      </main>
    </>
  )
}