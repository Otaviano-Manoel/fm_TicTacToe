import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const prevLocationRef = useRef<string | null>(null);
  const [prevLocation, setPrevLocation] = useState<string | null>(null);
  const isNavigatingRef = useRef<boolean>(false); // Flag to avoid infinite loop

  useEffect(() => {
    if (prevLocation === location.pathname) {
      setPrevLocation(null);
    }
    if (prevLocation && !isNavigatingRef.current) {
      let blocked: boolean = false;
      switch (prevLocation) {
        case '/':
          blocked = location.pathname === '/game' || location.pathname === '/connect';
          break;
        case '/game':
          blocked = location.pathname === '/' || location.pathname === '/game/panels';
          break;
        case '/connect':
          blocked = location.pathname === '/' || location.pathname === '/game';
          break;
        case '/game/panels':
          blocked = location.pathname === '/' || location.pathname === '/game';
          break;
        default:
          blocked = false;
      }
      if (!blocked) {
        isNavigatingRef.current = true; // Set flag to true before navigating
        navigate(prevLocation);
      }
    }

    if (!isNavigatingRef.current) {
      prevLocationRef.current = location.pathname;
      setPrevLocation(location.pathname);
    }

    return () => {
      isNavigatingRef.current = false; // Reset flag after effect execution
    };
    // eslint-disable-next-line
  }, [location, navigate]);

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
        <Route path="/connect" element={<ServerConfiguration />} />
        <Route path="/game" element={<Game />}>
          <Route path="panels" element={<PanelGame />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
