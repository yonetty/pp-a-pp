import React, { FunctionComponent } from "react";

export type CommentaryProps = {
  logs: string[];
}

export const Commentary: FunctionComponent<CommentaryProps> = (props) => {
  const items = props.logs.map((log, idx) => {
    return (
      <li key={idx}>{log}</li>
    );
  });

  return (
    <div className="commentary">
      <ul>
        {items}
      </ul>
    </div>
  );
}