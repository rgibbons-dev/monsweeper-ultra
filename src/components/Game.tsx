import { useState, useEffect } from "react";
import { Mon, Turn, Cell } from "../types";
import Battle from "./Battle";
import Dpad from "./Dpad";
import Grid from "./Grid";
import { useBattleStore } from "../store";

function Game() {
    const pikachu: Mon = {
        name: 'Pikachu',
        moves: [
            {
                name: 'Thunderbolt',
                damage: 80
            },
            {
                name: 'Protect',
                damage: 0
            }
        ],
        hp: 200,
        buff: false
    };
    const [userTurn, setUserTurn] = useState<Turn>({ pika: pikachu, currentSpace: 0 });
    const [isBattleStarted, setIsBattleStarted] = useState(false);

    const gsize = 3;

    function rand(max: number) {
        return Math.floor(Math.random() * max)
    }

    const [grid, setGrid] = useState<Cell[][]>(() => {
        const arr: Cell[][] = Array(gsize);
        for (let i = 0; i < gsize; i++) {
            arr[i] = Array(gsize);
            for (let j = 0; j < gsize; j++) {
                if (i === 0 && j === 0) {
                    arr[i][j] = {
                        space: (i * 3) + j + 1,
                        electrode: false,
                        userPresent: true
                    };
                } else {
                    arr[i][j] = {
                        space: (i * 3) + j + 1,
                        electrode: false,
                        userPresent: false
                    };
                }
            }
        }
        const electrodes = Math.sqrt(Math.pow(gsize, 2)) - 1;
        let placed = 0;
        while (placed < electrodes) {
            const row = rand(gsize);
            const col = rand(gsize);
            // zero is the default space for the user
            if (!arr[row][col].electrode && !arr[row][col].userPresent) {
                arr[row][col].electrode = true;
                placed++;
            }
        }
        return arr;
    });

    // move the user
    useEffect(() => {
        setGrid(cgrid => Array.from(cgrid).map(row => row.map(cell => ({
            ...cell,
            userPresent: cell.space - 1 === userTurn.currentSpace
        }))));
    }, [userTurn]);

    // check if a battle should be started or not
    useEffect(() => {
        grid.forEach(row => {
            const found = row.find(cell => cell.userPresent && cell.electrode)
            if (found !== undefined) {
                setIsBattleStarted(true);
                //useBattleStore((state) => state.begin)
            }
        });
    }, [grid]);

    return (
        <>
            <Battle go={isBattleStarted} />
            <Grid grid={grid} />
            <Dpad userTurn={userTurn} setUserTurn={setUserTurn} />
        </>
    );
}

export default Game;