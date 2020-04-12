import React, { FunctionComponent, useState } from "react";

export const ParentOperations: FunctionComponent = () => {
  return (
    <div className="parent-operations">
      <button type="button" name="open" value="open">オープン</button>
      <button type="button" name="newgame" value="newgame">次のゲーム</button>
    </div>
  )
}