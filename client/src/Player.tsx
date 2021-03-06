import React, { FunctionComponent, useState } from "react";
import Modal from 'react-modal';
import { Deck } from "./Deck";
import { CSSTransition } from 'react-transition-group';

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
  isMe: boolean;
  onBidChange: (bid: string) => void;
}

export const Player: FunctionComponent<PlayerProps> = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleModalOpen = () => {
    setModalIsOpen(true);
  }

  const handleModalClose = () => {
    setModalIsOpen(false);
  }

  const handleCardSelect = (point: string) => {
    //setBid(point);
    setModalIsOpen(false);
    props.onBidChange(point);
  }

  const playerIsMe = props.isMe ? "player-me" : "";
  const cardClickable = props.isMe && !props.open;
  const playerCardOpen = props.open ? "player-card-open" : "";
  // Until the parent player opens cards, it displays '?' for other players who have bid
  const point = (!props.open && !props.isMe && props.bid) ? "?" : props.bid;

  return (
    <div className={`player ${playerIsMe}`}>
      <div className="player-info">
        <div className={"player-icon-" + props.icon}>
        </div>
        <div className="player-name">{props.name}</div>
      </div>
      <CSSTransition
        in={props.open} appear={true} timeout={600} classNames="player-card-open-trans">
        <div className={`player-card ${playerCardOpen}`} onClick={cardClickable ? handleModalOpen : undefined}>
          <span className="point">{point}</span>
        </div>
      </CSSTransition>
      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}
        contentLabel="test" style={customStyles} >
        <Deck onCardSelected={handleCardSelect} />
      </Modal>
    </div>
  )
}
