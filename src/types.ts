type Move = {
  name: string,
  damage: number
};

type Mon = {
  name: string;
  moves: Move[];
  hp: number;
  buff: boolean;
};

type Turn = {
  pika: Mon;
  currentSpace: number;
};

type Cell = {
  space: number;
  electrode: boolean;
  userPresent: boolean;
};

export type { Move, Mon, Turn, Cell }