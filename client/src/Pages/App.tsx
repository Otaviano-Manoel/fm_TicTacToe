import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useGameBoard } from '../context/GameBoardContext';
import NewGame from './NewGame/NewGame';
import PanelGame from './Game/Panels/PanelGame';
import ServerConfiguration from './ServerConfiguration';
import { getDefaultIGameBoard } from '../interface/IGameBoard';
import Game from './Game/Game';
import ControllerSound from './ControllerSound/ControllerSound';
import { useGameManager } from '../context/GameManager';
import styles from './app.module.scss';

function App() {
  const { gameManager } = useGameManager();
  const { setGameBoard } = useGameBoard();
  const location = useLocation();

  useEffect(() => {
    if (gameManager.game.type === 'none') {
      setGameBoard(getDefaultIGameBoard());
    }
  }, [gameManager, setGameBoard, location]);

  return (
    <div className={styles.app}>
      <ControllerSound />
      <Routes>
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
