import { useEffect } from "react";
import Battle from "./Battle";
import Dpad from "./Dpad";
import Grid from "./Grid";
import { useBattleStore, useGridStore, useTurnStore } from "../store";
import { Route, useLocation } from "wouter";

function Game() {

    const userTurn = useTurnStore(state => state.turn);
    const grid = useGridStore(state => state.grid);
    const userMoved = useGridStore(state => state.userMoved);

    // move the user
    useEffect(() => {
        userMoved(userTurn);
    }, [userMoved, userTurn]);

    const isBattleStarted = useBattleStore(state => state.started);
    const battleStart = useBattleStore(state => state.begin);
    const [_location, setLocation] = useLocation();
    

    // check if a battle should be started or not
    useEffect(() => {
        for(const row of grid) {
            const found = row.find(cell => cell.userPresent && cell.electrode)
            if (found !== undefined) {
                battleStart();
                setLocation("/battle");
                break;
            }
        }
    }, [grid, battleStart, setLocation]);

    return (
        <>
            <Route path="/battle">
                <Battle go={isBattleStarted} return={setLocation} />
            </Route>
            <Route path="/">
                <Grid grid={grid} />
                <Dpad />
            </Route>
        </>
    );
}

export default Game;