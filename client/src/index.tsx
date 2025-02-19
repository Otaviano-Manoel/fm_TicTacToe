import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import './assets/style/reset.scss';
import GameManager from './context/GameManager';
import { BrowserRouter } from 'react-router-dom';
import GameBoard from './context/GameBoardContext';
import { SocketProvider } from './context/Socket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GameManager>
        <GameBoard>
          <SocketProvider>
            <App />
          </SocketProvider>
        </GameBoard>
      </GameManager>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
