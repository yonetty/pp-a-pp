import React, { FunctionComponent, useState } from "react";

export const GameResults: FunctionComponent = () => {
  return (
    <div className="game-results">
      <div className="game-result">
        <span className="result-key">平均</span>
        <span className="result-value">2.7</span>
      </div>
      <div className="game-result">
        <span className="result-key">中央値</span>
        <span className="result-value">3</span>
      </div>
    </div>
  )
}