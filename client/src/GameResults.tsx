import React, { FunctionComponent } from "react";
import { useTranslation } from 'react-i18next';

export type GameResultsProps = {
  show: boolean;
  bids: string[];
}

export const GameResults: FunctionComponent<GameResultsProps> = (props) => {
  // i18n
  const [t, i18n] = useTranslation();
  const points: number[] = props.bids.filter(b => b).map(b => Number(b));

  // Calculate average
  const calcAvg = (array: number[]): number => {
    const sum = array.reduce((p, c) => p + c, 0);
    const avg = array.length === 0 ? 0 : sum / array.length;
    return Math.round(avg * 10) / 10;
  }
  const avg = calcAvg(points);

  // Calculate median
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
        <span className="result-key">{t('label.average')}</span>
        <span> </span>
        <span className="result-value">{props.show ? avg : ""}</span>
      </div>
      <div className="game-result">
        <span className="result-key">{t('label.median')}</span>
        <span> </span>
        <span className="result-value">{props.show ? median : ""}</span>
      </div>
    </div>
  )
}