import React, { FunctionComponent, useState } from "react";

type ParentOperationsProps = {
  bidding: boolean;
  onOpen: () => void;
  onNewGame: () => void;
}

export const ParentOperations: FunctionComponent<ParentOperationsProps> = (props) => {

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
        onClick={handleOpenButtonClick}>オープン</button>
      <button type="button" name="newgame" value="newgame"
        onClick={handleNewGameButtonClick}>次のゲーム</button>
    </div>
  )
}