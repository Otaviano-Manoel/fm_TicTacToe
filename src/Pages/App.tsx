import React, { useEffect } from 'react';
import styled from './app.module.scss';
import { useGameManager } from '../Context/GameManager/GameManager';
import { Route, Routes } from 'react-router-dom';
import { NewGame } from './newGame';
import { PlayGame } from './game';
// este arquivo esta na pasta ./Pages

function App() {

  const { gameManager } = useGameManager();

  useEffect(() => {
  }, [gameManager.game.type]);

  useEffect(() => {
    localStorage.setItem('LOCAL_GAME_MANAGER', JSON.stringify(gameManager))
  }, [gameManager]);


  return (
    <div className={styled.app}>
      <Routes>
        <Route path='/' element={<NewGame />}></Route>
        <Route path='/game' element={<PlayGame />}></Route>
      </Routes>

    </div>
  );
}

export default App;
