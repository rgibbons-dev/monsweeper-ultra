interface Move {
  name: string,
  damage: number
};

interface Mon {
  name: string;
  moves: Move[];
  hp: number;
  buff: boolean;
};

interface Turn {
  pika: Mon;
  currentSpace: number;
};

interface Cell {
  space: number;
  electrode: boolean;
  userPresent: boolean;
};

export type { Move, Mon, Turn, Cell }