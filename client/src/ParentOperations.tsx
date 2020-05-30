import React, { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';

type ParentOperationsProps = {
  bidding: boolean;
  onOpen: () => void;
  onNewGame: () => void;
}

export const ParentOperations: FunctionComponent<ParentOperationsProps> = (props) => {
  // i18n
  const [t, i18n] = useTranslation();

  const handleOpenButtonClick = () => {
    props.onOpen();
  }

  const handleNewGameButtonClick = () => {
    props.onNewGame();
  }

  return (
    <div className="parent-operations">
      <button type="button" name="open"
        disabled={!props.bidding} value="open"
        onClick={handleOpenButtonClick}>{t('button.opencards')}</button>
      <button type="button" name="newgame" value="newgame"
        disabled={props.bidding}
        onClick={handleNewGameButtonClick}>{t('button.nextgame')}</button>
    </div>
  )
}