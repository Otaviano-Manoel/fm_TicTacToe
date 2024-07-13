import React, { useEffect, useState } from 'react';
import styled from './app.module.scss';
import { useGameManager } from '../Context/GameManager/GameManager';
import { Route, Routes } from 'react-router-dom';
import { NewGame } from './newGame';
import { Game } from './game';
import { useGameBoard } from '../Context/GameBoard/GameBoard';
import PanelGame from './game/panels/panelGame';
import Connect from './connecthost/Connect';
import { useSocket } from '../Context/server/Socket';
import { getDefaultIGameBoard } from '../Context/GameBoard/IGameBoard';

function App() {

  const { gameManager } = useGameManager();
  const { setGameBoard } = useGameBoard();

  useEffect(() => {
    if (gameManager.game.type === 'none') {
      resetBoard();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameManager.game.type]);


  const resetBoard = () => {
    let field: any = [];
    for (let index = 0; index < 9; index++) {
      field.push({ styled: '', marked: false, mark: null, winner: false });
    }
    setGameBoard(getDefaultIGameBoard());
  }


  return (
    <div className={styled.app}>
      <Routes>
        <Route path='/' element={<NewGame />}></Route>
        <Route path='/connecthost' element={<Connect />}></Route>
        <Route path='/game' element={<Game />}>
          <Route path='panels' element={<PanelGame />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
