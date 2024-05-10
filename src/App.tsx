import { Dispatch, KeyboardEvent, SetStateAction, useCallback, useEffect, useState } from 'react';
import './App.css'

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

function User() {
  return <div>🙂</div>;
}

function Grass(props: Cell) {
  return (
    <>
      <span>
        {props.userPresent ? (<User />) : props.space}
      </span>
    </>
  );
}

type GridProps = { grid: Cell[][]; };

function Grid(props: GridProps) {

  return (
    <>
      <div>
        {props.grid.map((row, rind) => (
          <div className="grasses" key={rind}>
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
  return (
    <>
      <button className='dirButton' onClick={() => props.fn()}>{props.direction}</button>
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
  
  const left = useCallback(() => {
    props.setUserTurn({ ...turn, currentSpace: cs - 1 });
  }, [cs, props, turn]);

  const right = useCallback(() => {
    props.setUserTurn({ ...turn, currentSpace: cs + 1 });
  }, [cs, props, turn]);

  const up = useCallback(() => {
    props.setUserTurn({ ...turn, currentSpace: cs - 3 });
  }, [cs, props, turn]);

  const down = useCallback(() => {
    props.setUserTurn({ ...turn, currentSpace: cs + 3 });
  }, [cs, props, turn]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowLeft':
          left();
          break;
        case 'ArrowRight':
          right();
          break;
        case 'ArrowUp':
          up();
          break;
        case 'ArrowDown':
          down();
          break;
        default:
          break;
      }
    },
    [left, right, up, down]
  );

  return (
    <>
      <div className='controller' onKeyDown={handleKeyDown} tabIndex={0}>
        <div>click here to focus</div>
        <div>
          <DirButton direction={'up'} fn={up}/>
        </div>
        <div>
          <DirButton direction={'left'} fn={left}/>
          <DirButton direction={'right'} fn={right}/>
        </div>
        <div>
          <DirButton direction={'down'} fn={down}/>
        </div>
      </div>
    </>
  );
}

type BattleProps = {
  go: boolean;
};

function Battle(props: BattleProps) {
  const msg = props.go ? 'Battle' : 'Ok';
  return (
    <>
      <div>{msg}</div>
    </>
  );
}

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
  const [userTurn, setUserTurn] = useState<Turn>({ pika: pikachu, currentSpace: 0});
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  const gsize = 3;

  function rand(max: number) {
    return Math.floor(Math.random() * max)
  }

  const [grid, setGrid] = useState<Cell[][]>(() => {
    const arr: Cell[][] = Array(gsize);
    for(let i=0; i<gsize; i++) {
      arr[i] = Array(gsize);
      for(let j=0; j<gsize; j++) {
        if(i === 0 && j === 0) {
          arr[i][j] = {
            space: (i*3)+j+1,
            electrode: false,
            userPresent: true
          };
        } else {
          arr[i][j] = {
            space: (i*3)+j+1,
            electrode: false,
            userPresent: false
          };
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
      if(found !== undefined) {
        setIsBattleStarted(true);
      }
    });
  }, [grid]);

  return (
    <>
      <Battle go={isBattleStarted} />
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
