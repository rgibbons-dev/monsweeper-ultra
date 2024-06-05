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
}

function hurt(mon: Mon, dmg: number) {
    if(mon.buff) return { ...mon, buff: false};
    return { ...mon, hp: mon.hp -= dmg};
}

function PlayerMove(props: PlayerProps) {
    const makeMove = () => {
        let move: Move;
        if(props.moveIndex === 0) {
            move = props.pikachu.moves[0];
        } else {
            move = props.pikachu.moves[1];
            props.pikachu.buff = true;
        }
        console.log(move.name);
        props.mutateElectrode(() => hurt(props.electrode, move.damage));
        console.log('electrode: ', props.electrode.hp);
        if(props.electrode.hp <= 0) props.end();
        const cpuMoveIndex = Math.floor(Math.random() + 0.5);
        const cpuMove = props.electrode.moves[cpuMoveIndex];
        console.log(cpuMove.name);
        props.mutatePikachu(hurt(props.pikachu, cpuMove.damage));
        console.log('pikachu: ', props.pikachu.hp);
        if(props.pikachu.hp <= 0) props.end();
    }   
    return(
        <>
            <button onClick={makeMove}>{props.name}</button>
        </>
    );
}

export default PlayerMove;