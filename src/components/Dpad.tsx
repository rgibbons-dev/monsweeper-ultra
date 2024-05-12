import { Dispatch, SetStateAction, useCallback, KeyboardEvent } from "react";
import { Turn } from "../types";
import { useUserTurnStore } from "../store";

type Direction = {
    direction: 'left' | 'right' | 'up' | 'down';
    fn: () => void;
};

function DirButton(props: Direction) {
    return (
        <>
            <button className='dirButton' onClick={() => props.fn()}>{props.direction}</button>
        </>
    );
}

type DpadProps = {
    userTurn: Turn;
    setUserTurn: Dispatch<SetStateAction<Turn>>;
};

function Dpad(props: DpadProps) {
    const turn = props.userTurn;
    const cs = turn.currentSpace;

    const moveUser = useUserTurnStore(state => state.move);

    const right = useCallback(() => {
        props.setUserTurn({ ...turn, currentSpace: cs + 1 });
    }, [cs, props, turn]);

    const up = useCallback(() => {
        props.setUserTurn({ ...turn, currentSpace: cs - 3 });
    }, [cs, props, turn]);

    const down = useCallback(() => {

        props.setUserTurn({ ...turn, currentSpace: cs + 3 });
    }, [cs, props, turn]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            switch (event.key) {
                case 'ArrowLeft':
                    moveUser(-1);
                    break;
                case 'ArrowRight':
                    right();
                    break;
                case 'ArrowUp':
                    up();
                    break;
                case 'ArrowDown':
                    down();
                    break;
                default:
                    break;
            }
        },
        [moveUser, right, up, down]
    );

    return (
        <>
            <div className='controller' onKeyDown={handleKeyDown} tabIndex={0}>
                <div>click here to focus</div>
                <div>
                    <DirButton direction={'up'} fn={up} />
                </div>
                <div>
                    <DirButton direction={'left'} fn={right} />
                    <DirButton direction={'right'} fn={right} />
                </div>
                <div>
                    <DirButton direction={'down'} fn={down} />
                </div>
            </div>
        </>
    );
}

export default Dpad;