import { useGridStore, useTurnStore } from "../store";
import { Mon, Turn } from "../types";

type BattleProps = {
    go: boolean;
    return: (to: string) => void;
};

function hurt(mon: Mon, dmg: number) {
    return { ...mon }.hp -= dmg;
}

function home(turn: Turn, post: (turn: Turn) => void, route: (to: string) => void) {
    post(turn);
    route("/");
}

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';
    const battleWon = useGridStore(state => state.battleWon);
    const turn = useTurnStore(state => state.turn);
    const callHome = () => home(turn, battleWon, props.return);
    return (
        <>
            <div>{msg}</div>
            <button onClick={callHome}>Battle ended</button>
        </>
    );
}

export default Battle;