import React, { FunctionComponent, useState } from "react";
import { ParentOperations } from "./ParentOperations";
import { GameResults } from "./GameResults";
import { Players } from "./Players";

type TableProps = {
  tableName: string
}

export const TablePage: FunctionComponent<TableProps> = (props) => {
  return (
    <>
      <header className="header">
        <span className="table-name">{props.tableName}</span>
      </header>
      <main>
        <ParentOperations />
        <GameResults />
        <Players />
      </main>
    </>
  )
}