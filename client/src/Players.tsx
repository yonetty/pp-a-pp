import React, { FunctionComponent, useState } from "react";
import { Player } from "./Player";

export const Players: FunctionComponent = () => {
  return (
    <div className="players">
      <Player name="信長" icon={1} bid="2" />
      <Player name="羽柴秀吉" icon={2} bid="3" />
      <Player name="家康" icon={3} bid="4" />
      <Player name="政宗" icon={4} bid="2" />
      <Player name="幸村" icon={1} bid="3" />
    </div>
  )
}