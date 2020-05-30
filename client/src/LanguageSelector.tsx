import React, { FunctionComponent } from "react";

export type LanguageSelectorProps = {
  languages: { code: string, name: string }[],
  selectedLanguage: string;
  onLanguageSelectionChange: (lang: string) => void;
}

export const LanugageSelector: FunctionComponent<LanguageSelectorProps> = (props) => {
  const langs = props.languages.map((lang) => {
    return (lang.code === props.selectedLanguage) ?
      (
        <span className="i18n-selected">{lang.name}</span>
      ) :
      (
        <span onClick={() => props.onLanguageSelectionChange(lang.code)}>{lang.name}</span>
      )
  });

  return (
    <p className="i18n">
      {langs}
    </p>
  );
}