import { Dispatch, SetStateAction } from "react";
import { Mon, Move } from "../types";

type PlayerProps = {
    name: string;
    moveIndex: number;
    pikachu: Mon;
    electrode: Mon;
    mutatePikachu: (p: Mon) => void;
    mutateElectrode: Dispatch<SetStateAction<Mon>>;
    end: () => void;
    displayAction: Dispatch<SetStateAction<string>>;
}

function hurt(mon: Mon, dmg: number): Mon {
    if(mon.buff) return { ...mon, buff: false};
    return { ...mon, hp: mon.hp -= dmg};
}

function PlayerMove(props: PlayerProps) {
    let waitForMove = false;
    const makeMove = () => {
        let move: Move;
        if(props.moveIndex === 0) {
            move = props.pikachu.moves[0];
        } else {
            move = props.pikachu.moves[1];
            props.pikachu.buff = true;
        }
        if(props.electrode.hp <= move.damage) {
            props.mutateElectrode(() => ({...props.electrode, hp: 0}));
            props.displayAction(() => `Pikachu used ${move.name}! Electrode took ${move.damage} and has fainted!`);
            setTimeout(() => props.end(), 2000);
            return;
        } else {
            props.mutateElectrode(() => hurt(props.electrode, move.damage));
            if(props.pikachu.buff) props.displayAction(() => `Pikachu used ${move.name}!`);
            else props.displayAction(() => `Pikachu used ${move.name}! Electrode took ${move.damage} and now has ${props.electrode.hp}HP remaining.`);
        }
        waitForMove = true;
        setTimeout(() => {
            const cpuMoveIndex = Math.floor(Math.random() + 0.5);
            const cpuMove = props.electrode.moves[cpuMoveIndex];
            if(props.pikachu.hp <= cpuMove.damage) {
                props.mutatePikachu({...props.pikachu, hp: 0});                
                props.displayAction(() => `Electrode used ${cpuMove.name}! Pikachu took ${cpuMove.damage} and has fainted!`);
                props.end();
            } else {
                props.mutatePikachu(hurt(props.pikachu, cpuMove.damage));
                if(props.pikachu.buff) props.displayAction(() => `Pikachu blocked the attack!`);
                else props.displayAction(() => `Electrode used ${cpuMove.name}! Pikachu took ${cpuMove.damage} and now has ${props.pikachu.hp}HP remaining.`);
            }
        }, 2000);
        waitForMove = false;
    }   
    return(
        <>
            <button disabled={waitForMove} onClick={makeMove}>{props.name}</button>
        </>
    );
}

export default PlayerMove;