import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import styled from './app.module.scss';
import { useGameManager } from '../context/GameManager';
import { useGameBoard } from '../context/GameBoardContext';
import NewGame from './newGame';
import Game from './game';
import PanelGame from './game/panels/panelGame';
import ServerConfiguration from './ServerConfiguration';
import { getDefaultIGameBoard } from '../interface/IGameBoard';

function App() {

  const { gameManager } = useGameManager();
  const { setGameBoard } = useGameBoard();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameManager.game.type === 'none') {
      setGameBoard(getDefaultIGameBoard());
    };
  }, [gameManager, navigate]);

  return (
    <div className={styled.app}>
      <Routes >
        <Route index path='/' element={<NewGame />} />
        <Route path="/connecthost" element={<ServerConfiguration />} />
        <Route path="/game" element={<Game />}>
          <Route path="panels" element={<PanelGame />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
