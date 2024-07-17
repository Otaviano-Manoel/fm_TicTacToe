import React, { useCallback, useEffect, useRef } from 'react';
import background from '../../assets/sound/background.mp3';
import click from '../../assets/sound/click.mp3';
import lose from '../../assets/sound/lose.mp3';
import win from '../../assets/sound/win.mp3';
import { useGameManager } from '../../context/GameManager';
import ControllerGameManager from '../../utils/GameMangerUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import styled from './controllerSound.module.scss';
import classNames from 'classnames';
import ActiveSound from '../../utils/soundActive';
import { useLocation } from 'react-router-dom';

function ControllerSound() {
    const { gameManager, setGameManager } = useGameManager();
    const location = useLocation();

    const backgroundAudioRef = useRef<HTMLAudioElement>(null);
    const clickAudioRef = useRef<HTMLAudioElement>(null);
    const loseAudioRef = useRef<HTMLAudioElement>(null);
    const winAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const startAudio = () => {
            if (backgroundAudioRef.current && gameManager.sound.play) {
                if (backgroundAudioRef.current.paused) {
                    playBackground();
                }
            } else {
                backgroundAudioRef.current?.pause();
            }
        };

        window.addEventListener('click', startAudio);

        return () => {
            window.removeEventListener('click', startAudio);
        };
        //eslint-disable-next-line
    }, [gameManager]);

    const getClassName = useCallback(() => {
        return {
            line: classNames(
                styled.line,
                !gameManager.sound.play && location.pathname === '/' ? styled.active : ''
            ),
            button: classNames(location.pathname === '/' ? styled.active : '')
        };
    }, [gameManager.sound.play, location.pathname]);

    const handleButtonClick = () => {
        ActiveSound.click(gameManager, setGameManager);
        setGameManager(
            ControllerGameManager.updateValues(['sound.play'], [!gameManager.sound.play], gameManager)
        );
        playBackground();
    };

    const playBackground = () => {
        if (gameManager.sound.play && backgroundAudioRef.current) {
            backgroundAudioRef.current.play().catch(error => {
                console.error('Erro ao tentar reproduzir o áudio:', error);
            });
            backgroundAudioRef.current.volume = 0.2;
        } else if (backgroundAudioRef.current) {
            backgroundAudioRef.current.pause();
        }
    };

    useEffect(() => {
        if (gameManager.sound.click && clickAudioRef.current) {
            clickAudioRef.current.play();
            setGameManager(ControllerGameManager.updateValues(['sound.click'], [false], gameManager));
        }
        if (gameManager.sound.win && winAudioRef.current) {
            winAudioRef.current.play();
            setGameManager(ControllerGameManager.updateValues(['sound.win'], [false], gameManager));
        }
        if (gameManager.sound.lose && loseAudioRef.current) {
            loseAudioRef.current.play();
            setGameManager(ControllerGameManager.updateValues(['sound.lose'], [false], gameManager));
        }
        if (gameManager.sound.draw && winAudioRef.current) {
            winAudioRef.current.play();
            setGameManager(ControllerGameManager.updateValues(['sound.draw'], [false], gameManager));
        }
    }, [gameManager, setGameManager]);

    return (
        <div className={styled.sound}>
            <button className={getClassName().button} aria-label='Activate or deactivate the sound' onClick={handleButtonClick} type="button">
                <FontAwesomeIcon icon={faVolumeUp} />
                <div className={getClassName().line}></div>
            </button>
            <audio ref={backgroundAudioRef} src={background} loop></audio>
            <audio ref={clickAudioRef} src={click}></audio>
            <audio ref={winAudioRef} src={win}></audio>
            <audio ref={loseAudioRef} src={lose}></audio>
        </div>
    );
}

export default ControllerSound;
