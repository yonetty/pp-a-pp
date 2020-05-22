import React, { FunctionComponent, useContext } from "react";
import { AppContext } from "./AppContext";

type DeckProps = {
  onCardSelected: (point: string) => void;
}

export const Deck: FunctionComponent<DeckProps> = (props) => {
  const appContext = useContext(AppContext);

  const handleCardSelect = (point: string) => {
    props.onCardSelected(point);
  }

  const cards = appContext.deck.map((point) => {
    return (
      <div className="deck-card" onClick={() => handleCardSelect(point)} >
        <span className="point">{point}</span>
      </div>
    );
  });
  return (
    <div className="deck">
      {cards}
    </div>
  );
}