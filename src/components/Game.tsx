import { useEffect } from "react";
import Battle from "./Battle";
import Dpad from "./Dpad";
import Grid from "./Grid";
import { useBattleStore, useGridStore, useTurnStore } from "../store";

function Game() {

    const userTurn = useTurnStore(state => state.turn);
    const grid = useGridStore(state => state.grid);
    const userMoved = useGridStore(state => state.userMoved);

    // move the user
    useEffect(() => {
        userMoved(userTurn);
    }, [userMoved, userTurn]);

    const isBattleStarted = useBattleStore(state => state.started);
    const startBattle = useBattleStore(state => state.begin);
    const endBattle = useBattleStore(state => state.end);
    

    // check if a battle should be started or not
    useEffect(() => {
        for(const row of grid) {
            const found = row.find(cell => cell.userPresent && cell.electrode)
            if (found !== undefined) {
                startBattle();
                break;
            }
            // temporary
            else {
                endBattle();
            }
        }
    }, [grid, startBattle, endBattle]);

    return (
        <>
            <Battle go={isBattleStarted} />
            <Grid grid={grid} />
            <Dpad />
        </>
    );
}

export default Game;