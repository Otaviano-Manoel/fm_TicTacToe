import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import './assets/style/reset.scss';
import GameManager from './Context/GameManager/GameManager';
import { BrowserRouter } from 'react-router-dom';
import GameBoard from './Context/GameBoard/GameBoard';
import { SocketProvider } from './Context/server/Socket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <GameManager>
          <GameBoard>
            <App />
          </GameBoard>
        </GameManager>
      </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
