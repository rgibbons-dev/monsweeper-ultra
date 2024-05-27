import { create } from "zustand";
import { Cell, Mon, Turn } from "./types";

const gsize = 3;

function rand(max: number) {
    return Math.floor(Math.random() * max)
}

function gen() {
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
}

function locate(grid: Cell[][], turn: Turn) {
    return Array.from(grid).map(row => row.map(cell => ({
        ...cell,
        userPresent: cell.space - 1 === turn.currentSpace
    })));
}

function removeElectrode(grid: Cell[][], turn: Turn) {
    return Array.from(grid).map(row => row.map(cell => ({
        ...cell,
        electrode: cell.space - 1 === turn.currentSpace ? false : cell.electrode
    })));
}

type GridState = {
    grid: Cell[][];
};

type GridAction = {
    userMoved: (turn: Turn) => void;
    battleWon: (turn: Turn) => void;
};

const useGridStore = create<GridState & GridAction>((set) => ({
    grid: gen(),
    userMoved: (turn: Turn) => set((state) => ({ grid: locate(state.grid, turn) })),
    battleWon: (turn: Turn) => set((state) => ({ grid: removeElectrode(state.grid, turn) }))
}));

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

type TurnState = {
    turn: Turn;
};

type TurnAction = {
    move: (d: number) => void;
};

const useTurnStore = create<TurnState & TurnAction>((set) => ({
    turn: { pika: pikachu, currentSpace: 0 },
    move: (distance: number) => set((state) => ({ turn: { ...state.turn, currentSpace: state.turn.currentSpace + distance } }))
}));

type BattleState = {
    started: boolean;
};

type BattleAction = {
    begin: () => void;
    end: () => void;
};

const useBattleStore = create<BattleState & BattleAction>((set) => ({
    started: false,
    begin: () => set(() => ({ started: true })),
    end: () => set(() => ({ started: false }))
}));

export { useBattleStore, useGridStore, useTurnStore }