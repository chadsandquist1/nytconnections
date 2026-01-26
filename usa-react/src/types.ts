// Types for USA Map app

export interface StateData {
  name: string;
  capital: string;
  population: string;
}

export type StatesDataMap = Record<string, StateData>;

export interface CustomStateConfig {
  fill: string;
  onClick: () => void;
}

export type CustomStatesMap = Record<string, CustomStateConfig>;
