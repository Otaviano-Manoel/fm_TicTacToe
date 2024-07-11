import React, { useEffect } from 'react';
import styled from './app.module.scss';
import { useGameManager } from '../Context/GameManager/GameManager';
import { Route, Routes } from 'react-router-dom';
import { NewGame } from './newGame';
import { Game } from './game';
import { useGameBoard } from '../Context/GameBoard/GameBoard';
import PanelGame from './game/panels/panelGame';

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
    setGameBoard({
      endGame: false,
      startGame: false,
      turn: true,
      fields: field,
      markWinner: undefined,
      numberWins: {
        ties: 0,
        x: 0,
        o: 0,
      },
    });
  }


  return (
    <div className={styled.app}>
      <Routes>
        <Route path='/' element={<NewGame />}></Route>
        <Route path='/game' element={<Game />}>
          <Route path='panels' element={<PanelGame />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
