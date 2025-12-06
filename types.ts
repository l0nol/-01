export type ElementCategory = 
  | 'alkali-metal' 
  | 'alkaline-earth-metal' 
  | 'transition-metal' 
  | 'post-transition-metal' 
  | 'metalloid' 
  | 'nonmetal' 
  | 'halogen' 
  | 'noble-gas' 
  | 'lanthanide' 
  | 'actinide' 
  | 'unknown';

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  enName: string;
  mass: number;
  category: ElementCategory;
  group: number;
  period: number;
  electronConfig: string; // e.g., "[He] 2s2"
  shells: number[]; // e.g., [2, 1]
  meltingPoint?: number; // Kelvin
  boilingPoint?: number; // Kelvin
  density?: number; // g/cm3
  electronegativity?: number; // Pauling
  oxidationStates?: string;
  discovery: string;
  summary: string;
}
