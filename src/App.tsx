import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import './App.css'

type Mon = {
  name: string;
  moves: string[];
  hp: number;
  buff: boolean;
};

function hurt(mon: Mon, dmg: number) {
  return {...mon}.hp -= dmg;
}

type Turn = {
  pika: Mon;
  currentSpace: number;
};

type Cell = {
  space: number;
  electrode: boolean;
  userPresent: boolean;
};

type Direction = { 
  direction: 'left' | 'right' | 'up' | 'down';
  fn: () => void;
};

function Grass(props: Cell) {
  return (
    <>
      <span>{props.space}</span>
    </>
  );
}

type GridProps = { grid: Cell[][]; };

function Grid(props: GridProps) {

  return (
    <>
      <div className='grasses'>
        {props.grid.map((row, rind) => (
          <div key={rind}>
            {row.map((cell, cind) => (
              <Grass
                key={`${rind}-${cind}`}
                space={cell.space}
                electrode={cell.electrode}
                userPresent={cell.userPresent}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function DirButton(props: Direction) {
  function move() {
    props.fn;
  }
  return (
    <>
      <button onClick={() => move()}>{props.direction}</button>
    </>
  );
}

type DpadProps = {
  userTurn: Turn;
  setUserTurn: Dispatch<SetStateAction<Turn>>;
};

function Dpad(props: DpadProps) {
  const turn = props.userTurn;
  const cs = turn.currentSpace;
  function left() {
    props.setUserTurn({...turn, currentSpace: cs - 1});
  }
  
  function right() {
    props.setUserTurn({...turn, currentSpace: cs + 1});
  }
  
  function up() {
    props.setUserTurn({...turn, currentSpace: cs - 3});
  }
  
  function down() {
    props.setUserTurn({...turn, currentSpace: cs + 3});
  }

  return (
    <>
      <DirButton direction={'left'} fn={left}/>
      <DirButton direction={'right'} fn={right}/>
      <DirButton direction={'up'} fn={up}/>
      <DirButton direction={'down'} fn={down}/>
    </>
  );
}

function Game() {
  const pikachu: Mon = {
    name: 'Pikachu',
    moves: ['Thunderbolt', 'Protect'],
    hp: 200,
    buff: false
  };
  const [userTurn, setUserTurn] = useState<Turn>({ pika: pikachu, currentSpace: 0});

  const gsize = 3;

  function rand(max: number) {
    return Math.floor(Math.random() * max)
  }

  const [grid, setGrid] = useState<Cell[][]>(() => {
    const arr: Cell[][] = Array(gsize);
    for(let i=0; i<gsize; i++) {
      arr[i] = Array(gsize);
      for(let j=0; j<gsize; j++) {
        arr[i][j] = {
          space: (i*3)+j+1,
          electrode: false,
          userPresent: false
        };
        if(i === 0 && j === 0) {
          arr[i][j].userPresent = true;
        }
      }
    }
    const electrodes = Math.sqrt(Math.pow(gsize,2)) - 1;
    let placed = 0;
    while(placed < electrodes) {
      const row = rand(gsize);
      const col = rand(gsize);
      // zero is the default space for the user
      if(!arr[row][col].electrode && !arr[row][col].userPresent) {
        arr[row][col].electrode = true;
        placed++;
      }
    }
    return arr;
  });

  useEffect(() => {
    setGrid(cgrid => Array.from(cgrid).map(row => row.map(cell => ({
      ...cell,
      userPresent: cell.space === userTurn.currentSpace
    }))));
  }, [userTurn.currentSpace]);

  return (
    <>
      <Grid grid={grid}/>
      <Dpad userTurn={userTurn} setUserTurn={setUserTurn}/>
    </>
  );
}

function App() {

  return (
    <>
      <Game/>
    </>
  )
}

export default App
