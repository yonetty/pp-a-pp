import React, { FunctionComponent, useState, useEffect } from "react";
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

  useEffect(() => {
    axios.get(`/table/${props.tableId}/players`)
      .then((res) => {
        const players: PlayerProps[] =
          res.data.players.map((p: string, idx: number) => {
            return {
              name: p,
              icon: (idx + 1) % 4,
              bid: "",
              open: false,
            }
          });
        console.log(`Got ${players.length} players by ajax call.`)
        setPlayers(players);
      }).catch((error) => {
        console.log("通信失敗")
        console.log(error.status);
      });
  }, []);

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
    console.log('handleBidChange was called.')
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