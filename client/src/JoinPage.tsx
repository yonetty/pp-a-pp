import React, { FunctionComponent } from "react";

type JoinPageProps = {
  tableId: string;
  tableName: string;
}

export const JoinPage: FunctionComponent<JoinPageProps> = (props) => {
  const action = `/table/${props.tableId}/join`;
  return (
    <>
      <header className="header">
        <h1 className="title">Planning Poker</h1>
        <p className="description">
          「{props.tableName}」に参加してプラニング・ポーカーを行いましょう!<br />
            ニックネームを入力してください
        </p>
      </header>
      <main>
        <form className="openForm" action={action} method="POST">
          <input name="nickname" type="text" required placeholder="ニックネーム" />
          <input type="submit" value="参加する" />
        </form>
      </main>
    </>
  )
}