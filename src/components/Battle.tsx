import { useBattleStore, useGridStore, useTurnStore } from "../store";
import { Mon, Turn } from "../types";

type BattleProps = {
    go: boolean;
    return: (to: string) => void;
};

function hurt(mon: Mon, dmg: number) {
    if(mon.buff) return mon;
    return { ...mon, hp: mon.hp -= dmg};
}

function home(turn: Turn, post: (turn: Turn) => void, route: (to: string) => void) {
    post(turn);
    route("/");
}

function staging(pikachu: Mon, end: () => void) {
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
    const cur = 'player';
    battleSeq(cur, pikachu, electrode);
    end();
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

let playerChoose: number;

const moveZero = () => playerChoose = 0;
const moveOne = () => playerChoose = 1;

function playerTurn(pikachu: Mon, electrode: Mon) {
    while(playerChoose === -1) {}
    const move = pikachu.moves[playerChoose];
    console.log(move.name);
    const eDamaged = hurt(electrode, move.damage);
    playerChoose = -1;
    if(eDamaged.hp < 0) return;
    battleSeq('cpu', pikachu, eDamaged);
}

function cpuTurn(pikachu: Mon, electrode: Mon) {
    const move = electrode.moves[Math.random()];
    console.log(move.name);
    const pDamaged = hurt(pikachu, move.damage);
    if(pDamaged.hp <= 0) return;
    battleSeq('player', pDamaged, electrode);
}

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';
    const battleWon = useGridStore(state => state.battleWon);
    const turn = useTurnStore(state => state.turn);
    const callHome = () => home(turn, battleWon, props.return);
    const pikachu = useTurnStore(state => state.turn.pika);
    const battleEnd = useBattleStore(state => state.end);
    const stagingWrapper = () => staging(pikachu, battleEnd);
    return (
        <>
            <div>
                <div>{msg}</div>
                <button onClick={callHome}>Battle ended</button>
            </div>
            <div>
                <button onClick={stagingWrapper}>start battle</button>
            </div>
            <div>
                <button onClick={moveZero}>Thunderbolt</button>
                <button onClick={moveOne}>Protect</button>
            </div>
        </>
    );
}

export default Battle;