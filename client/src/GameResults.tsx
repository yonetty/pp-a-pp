import React, { FunctionComponent, useState } from "react";

export type GameResultsProps = {
  bids: string[];
}

export const GameResults: FunctionComponent<GameResultsProps> = (props) => {
  const points: number[] = props.bids.filter(b => b).map(b => Number(b));
  // 平均値算出
  const calcAvg = (array: number[]): number => {
    const sum = array.reduce((p, c) => p + c, 0);
    const avg = array.length === 0 ? 0 : sum / array.length;
    return Math.round(avg * 10) / 10;
  }
  const avg = calcAvg(points);

  // 中央値算出
  const calcMedian = (array: number[]): number => {
    if (array.length === 0) {
      return 0;
    }
    array.sort((a, b) => a - b);
    const half = Math.floor(array.length / 2);
    const median = array.length % 2 ? array[half] : (array[half - 1] + array[half]) / 2;
    return Math.round(median * 10) / 10;
  }
  const median = calcMedian(points);

  return (
    <div className="game-results">
      <div className="game-result">
        <span className="result-key">平均</span>
        <span className="result-value">{avg}</span>
      </div>
      <div className="game-result">
        <span className="result-key">中央値</span>
        <span className="result-value">{median}</span>
      </div>
    </div>
  )
}