import React, { FunctionComponent } from "react";

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
          <select name="decktype" required>
            <option value="" selected>--- デッキを選択 ---</option>
            <option value="int">整数</option>
            <option value="half">0.5刻み</option>
            <option value="fibo">フィボナッチ</option>
          </select>
          <input type="submit" value="場を開く" />
        </form>
      </main>
    </>
  )
}