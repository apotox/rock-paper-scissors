

export type Game = {
    id: string;
    entities: Entity[];
}

export interface Entity {
    id: string;
    systems: string[]
    draw: (engine: any) => void;
    x: number;
    y: number;
    onTouched?: () => void;
}


export type GameSystem = {
    name: string;
    func: (engine: any, entity: Entity) => void;
}

export enum Images {
    rock = 'rock',
    paper = 'paper',
    scissors = 'scissors'
}