import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    const backgroundRef = useRef<HTMLAudioElement>(null);
    const clickRf = useRef<HTMLAudioElement>(null);
    const loseRef = useRef<HTMLAudioElement>(null);
    const winRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Função para iniciar a reprodução do áudio
        const startAudio = () => {
            if (backgroundRef.current && gameManager.sound.play) {
                if (backgroundRef.current.paused) {
                    backgroundRef.current.play().then(() => {
                        playBackground();
                    }).catch(error => {
                        console.error('Erro ao tentar reproduzir o áudio:', error);
                    });
                }
            }
            else {
                backgroundRef.current?.pause();
            }
        };

        // Adiciona o manipulador de evento de clique na janela
        window.addEventListener('click', startAudio);

        // Limpa o manipulador de evento ao desmontar o componente
        return () => {
            window.removeEventListener('click', startAudio);
        };
    }, [gameManager]);

    const getClassName = useCallback(() => {
        return {
            line: classNames(styled.line, !gameManager.sound.play && location.pathname === '/' ? styled.active : ''),
            button: classNames(location.pathname === '/' ? styled.active : '')
        }
    }, [gameManager, location]);


    const handlerOnClick = () => {
        ActiveSound.click(gameManager, setGameManager);
        setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['sound.play'], [!gameManager.sound.play], gameManager))
        playBackground();
    }
    const playBackground = () => {
        if (gameManager.sound.play) {
            if (backgroundRef.current) {
                backgroundRef.current.play().catch(error => {
                    console.log('error no audio:', error);
                });
                backgroundRef.current.volume = 0.2;
            }
        }
        else {
            if (backgroundRef.current) {
                //backgroundRef.current.pause();
            }
        }
    }

    useEffect(() => {
        if (gameManager.sound.click) {
            if (clickRf) {
                clickRf.current?.play();
            }
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['sound.click'], [false], gameManager));
        }
        if (gameManager.sound.win) {
            if (winRef) {
                winRef.current?.play();
            }
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['sound.win'], [false], gameManager));
        }
        if (gameManager.sound.lose) {
            if (loseRef) {
                loseRef.current?.play();
            }
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['sound.lose'], [false], gameManager));
        }
        if (gameManager.sound.draw) {
            if (winRef) {
                winRef.current?.play();
            }
            setGameManager(new ControllerGameManager(gameManager).updateValuesArray(['sound.draw'], [false], gameManager));
        }
    }, [gameManager, setGameManager]);

    return (
        <div className={styled.sound}>
            <button className={getClassName().button} onClick={handlerOnClick} type="button">
                <FontAwesomeIcon icon={faVolumeUp} />
                <div className={getClassName().line}></div>
            </button>
            <audio ref={backgroundRef} src={background} loop autoPlay></audio>
            <audio ref={clickRf} src={click}></audio>
            <audio ref={winRef} src={win}></audio>
            <audio ref={loseRef} src={lose}></audio>
        </div>
    );
}

export default ControllerSound;