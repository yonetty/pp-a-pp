import React, { FunctionComponent, useState } from "react";
import { Player, PlayerProps } from "./Player";

type PlayersProps = {
  players: PlayerProps[];
}

export const Players: FunctionComponent<PlayersProps> = (props) => {
  const players = props.players.map((player, idx) => {
    return (
      <Player {...player} key={idx} />
    );
  });
  return (
    <div className="players">
      {players}
    </div>
  )
}