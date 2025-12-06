import React from 'react';
import { ElementData } from '../types';
import { categoryColors } from '../data';

interface ElementCellProps {
  element: ElementData;
  onClick: (e: ElementData) => void;
  isDimmed: boolean;
}

export const ElementCell: React.FC<ElementCellProps> = ({ element, onClick, isDimmed }) => {
  const color = categoryColors[element.category] || '#888';

  return (
    <div
      onClick={() => onClick(element)}
      className={`
        relative aspect-[4/5] p-1 flex flex-col justify-between cursor-pointer
        transition-all duration-300 transform border border-white/10
        hover:z-10 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
        active:scale-95
        ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'}
      `}
      style={{
        backgroundColor: `${color}20`, // 20% opacity hex
        borderColor: `${color}60`,
        boxShadow: `inset 0 0 10px ${color}10`,
      }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] sm:text-xs font-mono opacity-80">{element.number}</span>
        <span className="text-[8px] sm:text-[10px] opacity-60 hidden sm:block">{element.mass.toFixed(1)}</span>
      </div>
      
      <div className="text-center">
        <h2 
          className="text-md sm:text-xl font-bold font-sans tracking-tight"
          style={{ textShadow: `0 0 5px ${color}` }}
        >
          {element.symbol}
        </h2>
        <p className="text-[9px] sm:text-[10px] truncate">{element.name}</p>
      </div>

      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-1">
        <div 
          className="h-full" 
          style={{ width: `${(element.number / 118) * 100}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
};