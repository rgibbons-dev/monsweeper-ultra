import { Mon } from "../types";

type BattleProps = {
    go: boolean;
};

function hurt(mon: Mon, dmg: number) {
    return { ...mon }.hp -= dmg;
}

function Battle(props: BattleProps) {
    const msg = props.go ? 'Battle' : 'Ok';
    return (
        <>
            <div>{msg}</div>
        </>
    );
}

export default Battle;