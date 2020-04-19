import React, { FunctionComponent, useState } from "react";
import Modal from 'react-modal';
import { Deck } from "./Deck";

Modal.setAppElement('#app');
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)'
  }
};

export type PlayerProps = {
  name: string;
  icon: number;
  bid: string;
  open: boolean;
}

export const Player: FunctionComponent<PlayerProps> = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bid, setBid] = useState(props.bid);
  const points = ["0", "1", "2", "3", "5", "8"];

  const handleModalOpen = () => {
    setModalIsOpen(true);
  }

  const handleModalClose = () => {
    setModalIsOpen(false);
  }

  const handleCardSelect = (point: string) => {
    setBid(point);
    setModalIsOpen(false);
  }

  return (
    <div className="player">
      <div className="player-info">
        <div className={"player-icon-" + props.icon}>
        </div>
        <div className="player-name">{props.name}</div>
      </div>
      <div className="player-card" onClick={handleModalOpen}>
        <span className="point">{bid}</span>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}
        contentLabel="test" style={customStyles} >
        <Deck points={points} onCardSelected={handleCardSelect} />
      </Modal>
    </div>
  )
}
