import React, { FunctionComponent, useState } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";

type TableProps = {
  tableName: string;
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  const [bidding, setBidding] = useState(true)
  const [players, setPlayers] = useState(
    [
      { name: "織田信長", icon: 1, bid: "", open: false },
      { name: "丹羽長秀", icon: 2, bid: "", open: false },
      { name: "柴田勝家", icon: 3, bid: "", open: false },
      { name: "前田利家", icon: 4, bid: "", open: false },
      { name: "佐々成政", icon: 1, bid: "", open: false },
      { name: "明智光秀", icon: 2, bid: "", open: false },
    ]
  )

  const handleOpen = () => {
    const ps = players.slice();
    ps.forEach(p => p.open = true);
    setPlayers(ps);
    setBidding(false);
  }

  const handleNewGame = () => {
    const ps = players.slice();
    ps.forEach(p => {
      p.open = false;
      p.bid = "";
    });
    setPlayers(ps);
    setBidding(true);
  }

  const handleBidChange = (bid: string, idx: number) => {
    const ps = players.slice();
    ps[idx].bid = bid;
    setPlayers(ps);
  }

  return (
    <>
      <header className="header">
        <span className="table-name">{props.tableName}</span>
      </header>
      <main>
        <ParentOperations bidding={bidding}
          onOpen={handleOpen} onNewGame={handleNewGame} />
        <GameResults />
        <Players players={
          players.map((p, idx) => Object.assign(p,
            { onBidChange: (bid: string) => handleBidChange(bid, idx) }))
        } />
      </main>
    </>
  )
}