import React, { useState } from 'react';
import { X, atom, Activity, Zap, BookOpen } from 'lucide-react';
import { ElementData } from '../types';
import { categoryColors } from '../data';
import { AtomCanvas } from './visualizations/AtomCanvas';

interface DetailModalProps {
  element: ElementData;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ element, onClose }) => {
  const [viewMode, setViewMode] = useState<'bohr' | 'orbital' | 'filling'>('bohr');
  const color = categoryColors[element.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full h-full sm:h-[90vh] sm:w-[90vw] max-w-6xl bg-[#111] sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col sm:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: 3D Interaction */}
        <div className="w-full sm:w-1/2 h-[40vh] sm:h-full relative flex flex-col bg-gradient-to-b from-black to-[#111] p-4 border-b sm:border-b-0 sm:border-r border-white/10">
          <div className="flex space-x-2 mb-4 absolute top-4 left-4 z-10">
            {['bohr', 'orbital', 'filling'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 text-xs rounded-full uppercase tracking-wider border transition-all
                  ${viewMode === mode 
                    ? `bg-[${color}] text-white border-transparent shadow-[0_0_10px_${color}]` 
                    : 'bg-black/40 text-gray-400 border-white/20 hover:border-white/50'
                  }`}
                style={{ backgroundColor: viewMode === mode ? color : '' }}
              >
                {mode === 'bohr' ? '玻尔模型' : mode === 'orbital' ? '电子云' : '填充动画'}
              </button>
            ))}
          </div>
          
          <AtomCanvas element={element} mode={viewMode} />
          
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs opacity-70">
            <div className="p-2 bg-white/5 rounded">
              <div className="text-gray-400">电子数</div>
              <div className="text-lg font-mono text-white">{element.shells.reduce((a,b)=>a+b, 0)}</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-gray-400">中子数</div>
              <div className="text-lg font-mono text-white">{Math.round(element.mass - element.number)}</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-gray-400">电负性</div>
              <div className="text-lg font-mono text-white">{element.electronegativity || '-'}</div>
            </div>
             <div className="p-2 bg-white/5 rounded">
              <div className="text-gray-400">价电子</div>
              <div className="text-lg font-mono text-white">{element.shells[element.shells.length - 1]}</div>
            </div>
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="w-full sm:w-1/2 h-full overflow-y-auto p-6 sm:p-8 bg-[#0a0a0a]">
          <div className="flex items-end space-x-4 mb-6">
            <h1 
              className="text-6xl sm:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500"
              style={{ textShadow: `0 0 30px ${color}40` }}
            >
              {element.symbol}
            </h1>
            <div className="pb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{element.name}</h2>
              <p className="text-lg text-gray-400">{element.enName}</p>
            </div>
            <div className="ml-auto flex flex-col items-end pb-2">
               <span className="text-4xl font-mono font-thin text-white/20">#{element.number}</span>
               <span 
                className="px-2 py-1 rounded text-xs uppercase font-bold text-black"
                style={{ backgroundColor: color }}
               >
                 {element.category.replace(/-/g, ' ')}
               </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Properties Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Activity size={14}/> 物理性质</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>相对原子质量:</span> <span className="text-white">{element.mass}</span></div>
                    <div className="flex justify-between"><span>密度:</span> <span className="text-white">{element.density} g/cm³</span></div>
                    <div className="flex justify-between"><span>熔点:</span> <span className="text-white">{element.meltingPoint} K</span></div>
                    <div className="flex justify-between"><span>沸点:</span> <span className="text-white">{element.boilingPoint} K</span></div>
                  </div>
               </div>
               
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Zap size={14}/> 化学性质</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>电子构型:</span> <span className="text-white font-mono text-xs">{element.electronConfig}</span></div>
                    <div className="flex justify-between"><span>氧化态:</span> <span className="text-white">{element.oxidationStates}</span></div>
                    <div className="flex justify-between"><span>每层电子:</span> <span className="text-white font-mono">{element.shells.join(', ')}</span></div>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><BookOpen size={14}/> 发现与历史</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">{element.summary}</p>
              <div className="text-xs text-gray-500">Discovery: {element.discovery}</div>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden relative group">
               <img 
                 src={`https://picsum.photos/seed/${element.symbol}/800/400`} 
                 alt={element.name}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                 <span className="text-sm text-gray-300">Sample / Application Image (Placeholder)</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};