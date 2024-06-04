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
    console.log(move.name);
    const handler = () => console.log('clicked');
    const m0 = document.getElementById('move-0');
    m0?.addEventListener("click", handler);
    const m1 = document.getElementById('move-1');
    m1?.addEventListener("click", handler);
    const eDamaged = hurt(electrode, move.damage);
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
                <button id='move-0'>Thunderbolt</button>
                <button id='move-1'>Protect</button>
            </div>
        </>
    );
}

export default Battle;