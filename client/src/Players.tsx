import React, { FunctionComponent, useState } from "react";
import { Player, PlayerProps } from "./Player";

type PlayersProps = {
  players: PlayerProps[];
}

export const Players: FunctionComponent<PlayersProps> = (props) => {
  const players = props.players.map((player) => {
    return (
      <Player {...player} />
    );
  });
  return (
    <div className="players">
      {players}
    </div>
  )
}