import React, { FunctionComponent, useState } from "react";

type DeckProps = {
  points: string[];
}

export const Deck: FunctionComponent<DeckProps> = (props) => {

  const cards = props.points.map((point) => {
    return (
      <div className="deck-card" >
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