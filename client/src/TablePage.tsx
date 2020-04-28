import React, { FunctionComponent, useState } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";
import { PlayerProps } from "./Player";
import axios from 'axios';

type TableProps = {
  tableId: string;
  tableName: string;
  playerName: string;
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  const [bidding, setBidding] = useState(true);
  const [players, setPlayers] = useState<PlayerProps[]>([]);

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
    console.log('handleBidChange')
    debugger;
    ps[idx].bid = bid;
    setPlayers(ps);
  }

  axios.get(`/table/${props.tableId}/players`)
    .then((res) => {
      const players: PlayerProps[] =
        res.data.players.map((p: string) => {
          return {
            name: p,
            icon: 1,
            bid: "9",
            open: false,
          }
        });
      console.log('ajax get')
      debugger;
      setPlayers(players);
    }).catch((error) => {
      console.log("通信失敗")
      console.log(error.status);
    });

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