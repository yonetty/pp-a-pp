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
  const [showsResults, setShowsResults] = useState(false);
  const [players, setPlayers] = useState<PlayerProps[]>([]);

  useEffect(() => {
    axios.get(`/table/${props.tableId}/players`)
      .then((res) => {
        const players = mapPlayers(res.data.players, props.playerId);
        console.log(`Got ${players.length} players by ajax call.`)
        setPlayers(players);
      }).then(() => {
        // ルームを指定してWebSocket接続するためにイベント送出
        console.log("Joining a room (web socket)")
        socket.emit("join", props.tableId);
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

  useEffect(() => {
    socket.on("opened", (data: any) => {
      console.log("The parent player has opened cards.");
      const updatedPlayers = players.slice();
      updatedPlayers.forEach(p => p.open = true);
      setPlayers(updatedPlayers);
      setBidding(false);
      setShowsResults(true);
    });
    return () => {
      socket.off("opened");
    }
  }, [players, bidding, showsResults]);

  const handleOpen = () => {
    setTimeout(() => {
      console.log("Parent player is opening cards for table " + props.tableId);
      socket.emit("opening", props.tableId);
    }, 0);
  }

  useEffect(() => {
    socket.on("newgame_begun", (data: any) => {
      console.log("The parent player has begun a new game.");
      const updatedPlayers = players.slice();
      updatedPlayers.forEach(p => {
        p.open = false;
        p.bid = "";
      });
      setPlayers(updatedPlayers);
      setBidding(true);
      setShowsResults(false);
    });
    return () => {
      socket.off("newgame_begun");
    }
  }, [players, bidding, showsResults]);

  const handleNewGame = () => {
    setTimeout(() => {
      socket.emit("newgame", props.tableId);
    }, 0);
  }

  const handleBidChange = (bid: string, idx: number) => {
    const ps = players.slice();
    console.log('handleBidChange was called.')
    ps[idx].bid = bid;
    setPlayers(ps);
    setTimeout(() => {
      socket.emit("bidding", props.tableId, idx, bid);
    }, 0);
  }

  const isParent = props.playerId === 0;
  const bids = players.map(p => p.bid);

  return (
    <>
      <header className="header">
        <span className="table-name">{props.tableName}</span>
      </header>
      <main>
        {isParent && <ParentOperations bidding={bidding}
          onOpen={handleOpen} onNewGame={handleNewGame} />}
        {showsResults && <GameResults bids={bids} />}
        <Players players={
          players.map((p, idx) => Object.assign(p,
            { onBidChange: (bid: string) => handleBidChange(bid, idx) }))
        } />
      </main>
    </>
  )
}