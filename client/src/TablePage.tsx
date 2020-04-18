import React, { FunctionComponent, useState } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";

type TableProps = {
  tableName: string
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  const [players, setPlayers] = useState(
    [
      { name: "織田信長", icon: 1, bid: "3", open: false },
      { name: "丹羽長秀", icon: 2, bid: "2", open: false },
      { name: "柴田勝家", icon: 3, bid: "3", open: false },
      { name: "前田利家", icon: 4, bid: "4", open: false },
      { name: "佐々成政", icon: 1, bid: "2", open: false },
      { name: "明智光秀", icon: 2, bid: "3", open: false },
    ]
  )
  return (
    <>
      <header className="header">
        <span className="table-name">{props.tableName}</span>
      </header>
      <main>
        <ParentOperations />
        <GameResults />
        <Players players={players} />
      </main>
    </>
  )
}