// src/components/StockManager.tsx
import React, { useState } from 'react';
import { Tool } from '../data/toolsData';

type StockManagerProps = {
  tool: Tool;
  updateStock: (toolId: number, componentName: string, newStock: number) => void;
};

const StockManager: React.FC<StockManagerProps> = ({ tool, updateStock }) => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [newStock, setNewStock] = useState<number | ''>('');

  const handleUpdate = () => {
    if (selectedComponent && newStock !== '') {
      updateStock(tool.id, selectedComponent, Number(newStock));
    }
  };

  return (
    <div>
      <h3>Update Stok untuk {tool.name}</h3>
      <select onChange={(e) => setSelectedComponent(e.target.value)} value={selectedComponent}>
        <option value=''>Pilih Komponen</option>
        {tool.components.map((component, index) => (
          <option key={index} value={component.name}>
            {component.name}
          </option>
        ))}
      </select>
      <input
        type='number'
        placeholder='Stok Baru'
        value={newStock}
        onChange={(e) => setNewStock(e.target.value ? Number(e.target.value) : '')}
      />
      <button onClick={handleUpdate}>Update Stok</button>
    </div>
  );
};

export default StockManager;
