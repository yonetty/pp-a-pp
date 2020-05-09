import React, { FunctionComponent, useState, useEffect } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";
import { PlayerProps } from "./Player";
import axios from 'axios';
import io from 'socket.io-client';
import { join } from "path";

type TableProps = {
  tableId: string;
  tableName: string;
  playerId: number;
}

const socket: SocketIOClient.Socket = io();

const mapPlayers = (names: string[], myId: number) => {
  const players: PlayerProps[] =
    names.map((n: string, idx: number) => mapPlayer(n, idx === myId, idx));
  return players;
}

const mapPlayer = (name: string, isMe: boolean, pos: number) => {
  return {
    name: name,
    isMe: isMe,
    icon: (pos + 1) % 4,
    bid: "",
    open: false,
    onBidChange: (x: string) => { },
  }
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  const [bidding, setBidding] = useState(true);
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    axios.get(`/table/${props.tableId}/players`)
      .then((res) => {
        const players = mapPlayers(res.data.players, props.playerId);
        console.log(`Got ${players.length} players by ajax call.`)
        setPlayers(players);
      }).catch((error) => {
        console.log("通信失敗")
        console.log(error.status);
      });
    return () => {
      socket.close();
    }
  }, []);

  useEffect(() => {
    socket.on("joined", (data: any) => {
      console.log(`${data.playerName} has joined (ID=${data.playerId})`);
      const joined = mapPlayer(data.playerName, false, data.playerId);
      const updatedPlayers = players.slice();
      updatedPlayers.push(joined);
      setPlayers(updatedPlayers);
    });
    return () => {
      socket.off("joined");
    }
  }, [players]);

  useEffect(() => {
    socket.on("bidded", (data: any) => {
      console.log(`Player ${data.playerId} has changed the bid: ${data.bid}`);
      const idx: number = data.playerId;
      const updatedPlayer = { ...players[idx], ...{ bid: data.bid } };
      const updatedPlayers = players.map((p, i) => i === idx ? updatedPlayer : p);
      setPlayers(updatedPlayers);
    });
    return () => {
      socket.off("bidded");
    }
  }, [players]);

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
    setTimeout(() => {
      socket.emit("bidding", idx, bid);
    }, 0);
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