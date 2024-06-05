import { useEffect, useState } from "react";
import { useBattleStore, useGridStore, useTurnStore } from "../store";
import { Mon, Turn } from "../types";
import PlayerMove from "./PlayerMove";

type BattleProps = {
    go: boolean;
    return: (to: string) => void;
};

function home(turn: Turn, post: (turn: Turn) => void, route: (to: string) => void) {
    post(turn);
    route("/");
}

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';

    const battleWon = useGridStore(state => state.battleWon);
    const turn = useTurnStore(state => state.turn);
    const callHome = () => home(turn, battleWon, props.return);
    const ended = !useBattleStore(state => state.started);
    useEffect(() => {
        if(ended) callHome();
    }, [ended]);

    const pikachu = useTurnStore(state => state.turn.pika);
    const battleEnd = useBattleStore(state => state.end);
    const setPikachu = useTurnStore(state => state.mutate);
    const [electrode, setElectrode] = useState<Mon>({
        name: "electrode",
        hp: 200,
        moves: [
            {
                name: "Tackle",
                damage: 40
            },
            {
                name: "Tackle",
                damage: 40
            }
        ],
        buff: false
    });
    return (
        <>
            <div>
                <div>{msg}</div>
                <button onClick={callHome}>Battle ended</button>
            </div>
            <div>
                <PlayerMove 
                    name="thunderbolt"
                    moveIndex={0}
                    pikachu={pikachu} 
                    electrode={electrode}
                    mutatePikachu={setPikachu}
                    mutateElectrode={setElectrode}
                    end={battleEnd}
                />
                <PlayerMove 
                    name="protect"
                    moveIndex={1}
                    pikachu={pikachu} 
                    electrode={electrode}
                    mutatePikachu={setPikachu}
                    mutateElectrode={setElectrode}
                    end={battleEnd}
                />
            </div>
        </>
    );
}

export default Battle;