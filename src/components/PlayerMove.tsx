import { Dispatch, SetStateAction } from "react";
import { Mon, Move } from "../types";

type PlayerProps = {
    name: string;
    moveIndex: number;
    pikachu: Mon;
    electrode: Mon;
    mutatePikachu: Dispatch<SetStateAction<Mon>>;
    mutateElectrode: Dispatch<SetStateAction<Mon>>;
    end: () => void;
}

function hurt(mon: Mon, dmg: number) {
    if(mon.buff) return mon;
    return { ...mon, hp: mon.hp -= dmg};
}

function PlayerMove(props: PlayerProps) {
    const makeMove = () => {
        let move: Move;
        if(props.moveIndex === 0) {
            move = props.pikachu.moves[0];
        } else {
            move = props.pikachu.moves[1];
        }
        console.log(move.name);
        props.mutateElectrode(() => hurt(props.electrode, move.damage));
        if(props.electrode.hp <= 0) props.end(); // will electrode be updated?
        const cpuMove = props.electrode.moves[Math.random()];
        console.log(cpuMove.name);
        props.mutatePikachu(() => hurt(props.pikachu, cpuMove.damage));
        if(props.pikachu.hp <= 0) props.end();
        // need to update pikachu state in zustand store
    }   
    return(
        <>
            <button onClick={makeMove}>{props.name}</button>
        </>
    );
}

export default PlayerMove;