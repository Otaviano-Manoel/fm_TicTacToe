import { Dispatch, SetStateAction } from 'react';
import { IGameManager } from '../interface/IGameManager';
import ControllerGameManager from './GameMangerUtils';

export default class ActiveSound {
    static click(
        manager: IGameManager,
        setManger: Dispatch<SetStateAction<IGameManager>>
    ) {
        setManger(
            ControllerGameManager.updateValues(['sound.click'], [true], manager)
        );
    }
    static win(
        manager: IGameManager,
        setManger: Dispatch<SetStateAction<IGameManager>>
    ) {
        setManger(
            ControllerGameManager.updateValues(['sound.win'], [true], manager)
        );
    }
    static lose(
        manager: IGameManager,
        setManger: Dispatch<SetStateAction<IGameManager>>
    ) {
        setManger(
            ControllerGameManager.updateValues(['sound.lose'], [true], manager)
        );
    }
    static draw(
        manager: IGameManager,
        setManger: Dispatch<SetStateAction<IGameManager>>
    ) {
        setManger(
            ControllerGameManager.updateValues(['sound.draw'], [true], manager)
        );
    }
}
