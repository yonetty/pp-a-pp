import React, { FunctionComponent, useState, useEffect } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";
import { PlayerProps } from "./Player";
import axios from 'axios';
import io from 'socket.io-client';

type TableProps = {
  tableId: string;
  tableName: string;
  playerName: string;
}

const socket: SocketIOClient.Socket = io();

const mapPlayers = (names: string[]) => {
  const players: PlayerProps[] =
    names.map((n: string, idx: number) => {
      return {
        name: n,
        icon: (idx + 1) % 4,
        bid: "",
        open: false,
        onBidChange: (x) => { },
      }
    });
  return players;
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  const [bidding, setBidding] = useState(true);
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    axios.get(`/table/${props.tableId}/players`)
      .then((res) => {
        const players = mapPlayers(res.data.players);
        console.log(`Got ${players.length} players by ajax call.`)
        setPlayers(players);
        //socket.emit("join", props.tableId);
      }).catch((error) => {
        console.log("通信失敗")
        console.log(error.status);
      });
  }, []);

  useEffect(() => {
    socket.on("update", (data: any) => {
      const players = mapPlayers(data.players);
      console.log(`Got ${players.length} players on receiving an update event.`)
      setPlayers(players);
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