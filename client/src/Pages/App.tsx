import React, { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styled from './app.module.scss';
import { useGameManager } from '../context/GameManager';
import { useGameBoard } from '../context/GameBoardContext';
import NewGame from './NewGame/NewGame';
import PanelGame from './Game/Panels/PanelGame';
import ServerConfiguration from './ServerConfiguration';
import { getDefaultIGameBoard } from '../interface/IGameBoard';
import Game from './Game/Game';

function App() {

  const { gameManager } = useGameManager();
  const { setGameBoard } = useGameBoard();

  useEffect(() => {
    if (gameManager.game.type === 'none') {
      setGameBoard(getDefaultIGameBoard());
    };
  }, [gameManager]);

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
