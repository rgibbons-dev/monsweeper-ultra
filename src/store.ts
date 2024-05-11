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
    Array.from(grid).map(row => row.map(cell => ({
        ...cell,
        userPresent: cell.space - 1 === turn.currentSpace
    })))
}

type GridWrapper = { grid: Cell[][]; }

const useGridStore = create((set) => ({
    grid: gen(),
    userMoved: (turn: Turn) => set((state: GridWrapper) => ({ grid: locate(state.grid, turn) }))
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

const useUserTurnStore = create((set) => ({
    turn: { pika: pikachu, currentSpace: 0 },
    move: (distance: number) => set((state: Turn) => ({ turn: state.currentSpace + distance }))
}));

const useBattleStore = create((set) => ({
    started: false,
    begin: () => set(() => ({ started: true })),
    end: () => set(() => ({ started: false }))
}));

export { useBattleStore, useGridStore, useUserTurnStore }