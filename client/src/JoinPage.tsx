import React, { FunctionComponent, useState, useEffect } from "react";
import { LanugageSelector } from "./LanguageSelector";
import { useTranslation, Trans } from 'react-i18next';

type JoinPageProps = {
  tableId: string;
  tableName: string;
}

export const JoinPage: FunctionComponent<JoinPageProps> = (props) => {
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
  const action = `/table/${props.tableId}/join`;
  return (
    <>
      <header className="header">
        <h1 className="title">{t('title')}</h1>
        <p className="description">
          {t('message.desc1', { table: props.tableName })}<br />
          {t('message.desc2')}
        </p>
        <LanugageSelector languages={languages} selectedLanguage={currentLang} onLanguageSelectionChange={handleLanguageSelectionChange} />
      </header>
      <main>
        <form className="openForm" action={action} method="POST">
          <input name="nickname" type="text" required placeholder={t('placeholder.nickname')} />
          <input type="submit" value={t('button.join').toString()} />
        </form>
      </main>
    </>
  )
}