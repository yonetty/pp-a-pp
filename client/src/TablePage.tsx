import React, { FunctionComponent, useState, useEffect, useCallback } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";
import { PlayerProps } from "./Player";
import axios from 'axios';
import io from 'socket.io-client';
import { Commentary } from "./Commentary";
import { LanugageSelector } from "./LanguageSelector";
import { useTranslation } from 'react-i18next';

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

// Custom hook
const useLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = useCallback((log: string) => {
    const newLogs = [log].concat(logs);
    setLogs(newLogs);
  }, [logs]);
  return [logs, addLog] as const;
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  // i18n
  const [t, i18n] = useTranslation();
  const languages = [{ code: "ja", name: "Japanese" }, { code: "en", name: "English" }];
  const [currentLang, setCurrentLang] = useState("ja");
  // Change language of i18n
  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);
  // Handler
  const handleLanguageSelectionChange = (lang: string) => {
    setCurrentLang(lang);
  }

  const [bidding, setBidding] = useState(true);
  const [showsResults, setShowsResults] = useState(false);
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [logs, addLog] = useLogs();

  useEffect(() => {
    axios.get(`/table/${props.tableId}/players`)
      .then((res) => {
        const players = mapPlayers(res.data.players, props.playerId);
        console.log(`Got ${players.length} players by ajax call.`)
        setPlayers(players);
      }).then(() => {
        console.log("Joining a room (web socket)")
        socket.emit("join", props.tableId);
      }).catch((error) => {
        console.log("Ajax failure.")
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
      const log = t('message.playerjoin', { player: data.playerName });
      addLog(log);
    });
    return () => {
      socket.off("joined");
    }
  }, [players, logs]);

  useEffect(() => {
    socket.on("bidded", (data: any) => {
      console.log(`Player ${data.playerId} has changed the bid: ${data.bid}`);
      const idx: number = data.playerId;
      const updatedPlayer = { ...players[idx], ...{ bid: data.bid } };
      const updatedPlayers = players.map((p, i) => i === idx ? updatedPlayer : p);
      setPlayers(updatedPlayers);
      const allPlayersBidded = updatedPlayers.every(p => p.bid);
      if (allPlayersBidded) {
        const log = t('message.allbid');
        addLog(log);
      }
    });
    return () => {
      socket.off("bidded");
    }
  }, [players, logs]);

  useEffect(() => {
    socket.on("opened", (data: any) => {
      console.log("The parent player has opened cards.");
      const updatedPlayers = players.slice();
      updatedPlayers.forEach(p => p.open = true);
      setPlayers(updatedPlayers);
      setBidding(false);
      setShowsResults(true);
      const log = t('message.cardsopen');
      addLog(log);
    });
    return () => {
      socket.off("opened");
    }
  }, [players, bidding, showsResults, logs]);

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
      const log = t('message.newgame');
      addLog(log)
    });
    return () => {
      socket.off("newgame_begun");
    }
  }, [players, bidding, showsResults, logs]);

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
        <LanugageSelector languages={languages} selectedLanguage={currentLang} onLanguageSelectionChange={handleLanguageSelectionChange} />
      </header>
      <main>
        {isParent && <ParentOperations bidding={bidding}
          onOpen={handleOpen} onNewGame={handleNewGame} />}
        <GameResults show={showsResults} bids={bids} />
        <Players players={
          players.map((p, idx) => Object.assign(p,
            { onBidChange: (bid: string) => handleBidChange(bid, idx) }))
        } />
        <Commentary logs={logs} />
      </main>
    </>
  )
}