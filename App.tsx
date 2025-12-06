import React, { useState, useMemo } from 'react';
import { Search, ZoomIn, ZoomOut, Moon, Sun, Filter } from 'lucide-react';
import { elements, categoryColors } from './data';
import { ElementData } from './types';
import { ElementCell } from './components/ElementCell';
import { DetailModal } from './components/DetailModal';

// Grid Configuration
const GRID_COLS = 18;
const GRID_ROWS = 10; // 7 periods + spacing + lanthanides + actinides

const App: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter Logic
  const filteredElements = useMemo(() => {
    return elements.filter(el => {
      const matchesSearch = 
        el.name.includes(searchTerm) || 
        el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        el.number.toString().includes(searchTerm);
      const matchesCategory = activeCategory ? el.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const isElementDimmed = (el: ElementData) => {
    if (!searchTerm && !activeCategory) return false;
    // Check if in filtered list
    return !filteredElements.find(e => e.number === el.number);
  };

  // Grid Placement Logic
  const getGridPosition = (el: ElementData) => {
    let row = el.period;
    let col = el.group;

    // Handle Lanthanides (57-71)
    if (el.number >= 57 && el.number <= 71) {
      row = 9; // Below main table
      col = (el.number - 57) + 3; // Shift placement
    }
    // Handle Actinides (89-103)
    else if (el.number >= 89 && el.number <= 103) {
      row = 10;
      col = (el.number - 89) + 3;
    }
    
    return { gridColumn: col, gridRow: row };
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden relative">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">Pt</div>
          <h1 className="text-xl font-bold hidden sm:block tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Neon Periodic
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search element (name, symbol, number)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))} 
             className="p-2 hover:bg-white/10 rounded-full"
           ><ZoomOut size={18}/></button>
           <span className="text-xs font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
           <button 
             onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))} 
             className="p-2 hover:bg-white/10 rounded-full"
           ><ZoomIn size={18}/></button>
        </div>
      </header>

      {/* Category Filter Bar (Horizontal Scroll) */}
      <div className="fixed top-[60px] left-0 right-0 z-30 h-12 flex items-center px-4 overflow-x-auto no-scrollbar gap-2 bg-gradient-to-b from-black to-transparent pointer-events-auto">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-xs border transition-all ${!activeCategory ? 'bg-white text-black border-white' : 'bg-black/50 border-white/20 text-gray-400'}`}
        >
          All
        </button>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs border transition-all flex items-center gap-1.5`}
            style={{ 
              borderColor: activeCategory === cat ? color : `${color}40`,
              backgroundColor: activeCategory === cat ? `${color}20` : 'transparent',
              color: activeCategory === cat ? color : '#aaa'
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: color }}></div>
            {cat.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Main Table Container - Scrollable Canvas */}
      <main 
        className="flex-1 overflow-auto pt-[120px] pb-20 px-4 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div 
          className="mx-auto transition-transform duration-200 ease-out origin-top-left"
          style={{ 
            width: 'fit-content',
            transform: `scale(${zoomLevel})`,
            transformOrigin: '50% 0' // Zoom from top center
          }}
        >
           <div 
             className="grid gap-1 sm:gap-2"
             style={{ 
               gridTemplateColumns: `repeat(${GRID_COLS}, minmax(40px, 70px))`,
               gridTemplateRows: `repeat(${GRID_ROWS}, minmax(50px, 90px))`
             }}
           >
             {elements.map((el) => {
               // Skip rendering placeholder/empty cells if using a simple grid map, 
               // but here we map the data directly to grid positions.
               return (
                 <div 
                   key={el.number}
                   style={getGridPosition(el)}
                 >
                   <ElementCell 
                     element={el} 
                     onClick={setSelectedElement} 
                     isDimmed={isElementDimmed(el)}
                   />
                 </div>
               );
             })}
             
             {/* Labels for Lanthanides/Actinides ranges in the main grid gap */}
             <div className="col-start-3 row-start-6 flex items-center justify-center text-xs opacity-30 pointer-events-none border border-white/10 rounded-md">
                57-71
             </div>
             <div className="col-start-3 row-start-7 flex items-center justify-center text-xs opacity-30 pointer-events-none border border-white/10 rounded-md">
                89-103
             </div>
           </div>
        </div>
      </main>

      {/* Modal */}
      {selectedElement && (
        <DetailModal 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}
    </div>
  );
};

export default App;
