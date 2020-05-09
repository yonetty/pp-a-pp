import React, { FunctionComponent, useState } from "react";

export const TopPage: FunctionComponent = () => {
  return (
    <>
      <header className="header">
        <h1 className="title">Planning Poker</h1>
        <p className="description">
          チームメンバーでプラニング・ポーカーを行いましょう!<br />
            場名とニックネームを入力して開始します。
        </p>
      </header>
      <main>
        <form className="openForm" action="/table/open" method="POST">
          <input name="tablename" type="text" required placeholder="場名" />
          <input name="nickname" type="text" required placeholder="ニックネーム" />
          <input type="submit" value="場を開く" />
        </form>
      </main>
    </>
  )
}