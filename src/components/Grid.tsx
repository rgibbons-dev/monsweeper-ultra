import { Cell } from "../types";

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

export default Grid;