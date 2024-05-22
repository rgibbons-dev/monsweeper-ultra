import { KeyboardEvent } from "react";
import { useTurnStore } from "../store";

function Dpad() {

    const moveUser = useTurnStore(state => state.move);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveUser(-1);
                break;
            case 'ArrowRight':
                moveUser(1);
                break;
            case 'ArrowUp':
                moveUser(-3);
                break;
            case 'ArrowDown':
                moveUser(3);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className='controller' onKeyDown={handleKeyDown} tabIndex={0}>
                <div className='dirButton'>click here to focus</div>
            </div>
        </>
    );
}

export default Dpad;