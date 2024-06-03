import { useBattleStore, useGridStore, useTurnStore } from "../store";
import { Mon, Turn } from "../types";

type BattleProps = {
    go: boolean;
    return: (to: string) => void;
};

function hurt(mon: Mon, dmg: number) {
    // TODO: account for buff (protect)
    return { ...mon, hp: mon.hp -= dmg};
}

function home(turn: Turn, post: (turn: Turn) => void, route: (to: string) => void) {
    post(turn);
    route("/");
}

const staging = () => {
    const electrode: Mon = {
        name: "electrode",
        hp: 200,
        moves: [
            {
                name: "Tackle",
                damage: 40
            }
        ],
        buff: false
    };
    const pikachu = useTurnStore(state => state.turn.pika);
    const battleEnd = useBattleStore(state => state.end);
    const cur = 'player';
    battleSeq(cur, pikachu, electrode);
    battleEnd();
    // TODO: ensure pikachu state gets updated in turn store
}

function battleSeq(cur: 'player' | 'cpu', pikachu: Mon, electrode: Mon) {
    switch(cur) {
        case "player":
            playerTurn(pikachu, electrode);
            break;
        case "cpu":
            cpuTurn(pikachu, electrode);
            break;
        default:
            console.log("err: not player or cpu");
            break;
    }
}

function playerTurn(pikachu: Mon, electrode: Mon) {
    const move = pikachu.moves[0];
    const eDamaged = hurt(electrode, move.damage);
    // TODO: add guard here
    battleSeq('cpu', pikachu, eDamaged);
}

function cpuTurn(pikachu: Mon, electrode: Mon) {
    const move = electrode.moves[Math.random()];
    const pDamaged = hurt(pikachu, move.damage);
    // TODO add guard here
    battleSeq('player', pDamaged, electrode);
}

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';
    const battleWon = useGridStore(state => state.battleWon);
    const turn = useTurnStore(state => state.turn);
    const callHome = () => home(turn, battleWon, props.return);
    return (
        <>
            <div>
                <div>{msg}</div>
                <button onClick={callHome}>Battle ended</button>
            </div>
            <div>
                <button onClick={staging}>start battle</button>
            </div>
            <div>
                <button>Thunderbolt</button>
                <button>Protect</button>
            </div>
        </>
    );
}

export default Battle;