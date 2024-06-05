import { useEffect, useState } from "react";
import { useBattleStore, useGridStore, useTurnStore } from "../store";
import { Mon } from "../types";
import PlayerMove from "./PlayerMove";

type BattleProps = {
    go: boolean;
    return: (to: string) => void;
};

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';

    const battleWon = useGridStore(state => state.battleWon);
    const turn = useTurnStore(state => state.turn);
    const callHome = () => {
        battleWon(turn);
        props.return("/");
    };
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
                damage: 20
            },
            {
                name: "Self-Destruct",
                damage: 100
            }
        ],
        buff: false
    });
    const [battleAction, setBattleAction] = useState("");
    return (
        <>
            <div>
                <div>{msg}</div>
            </div>
            <div>
                <p>{battleAction}</p>
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
                    displayAction={setBattleAction}
                />
                <PlayerMove 
                    name="protect"
                    moveIndex={1}
                    pikachu={pikachu} 
                    electrode={electrode}
                    mutatePikachu={setPikachu}
                    mutateElectrode={setElectrode}
                    end={battleEnd}
                    displayAction={setBattleAction}
                />
            </div>
        </>
    );
}

export default Battle;