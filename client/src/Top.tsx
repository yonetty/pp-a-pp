import React, { FunctionComponent, useState } from "react";

export const Top: FunctionComponent = () => {
  return (
    <>
      <header className="header">
        <h1 className="title">Planning Poker</h1>
        <p className="description">
          チームメンバーでプラニング・ポーカーを行いましょう!<br />
            場名とニックネームを入力して開始します
        </p>
      </header>
      <main>
        <form className="openForm" action="#">
          <input id="tebleName" type="text" required placeholder="場名" />
          <input id="nickname" type="text" required placeholder="ニックネーム" />
          <input type="submit" value="場を開く" />
        </form>
      </main>
    </>
  )
}