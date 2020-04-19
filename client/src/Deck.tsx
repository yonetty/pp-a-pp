import React, { FunctionComponent, useState } from "react";

type DeckProps = {
  points: string[];
  onCardSelected: (point: string) => void;
}

export const Deck: FunctionComponent<DeckProps> = (props) => {

  const handleCardSelect = (point: string) => {
    props.onCardSelected(point);
  }

  const cards = props.points.map((point) => {
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