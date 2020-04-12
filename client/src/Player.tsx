import React, { FunctionComponent, useState } from "react";

type PlayerProps = {
  name: string;
  icon: number;
  bid: string;
}

export const Player: FunctionComponent<PlayerProps> = (props) => {
  return (
    <div className="player">
      <div className="player-info">
        <div className={"player-icon-" + props.icon}>
        </div>
        <div className="player-name">{props.name}</div>
      </div>
      <div className="player-card">
        <span className="point">{props.bid}</span>
      </div>
    </div>
  )
}