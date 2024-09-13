// src/components/ToolDetails.tsx
import React from 'react';
import { Tool } from '../data/toolsData';

type ToolDetailsProps = {
  tool: Tool;
  onAssemble: () => void;
};

const ToolDetails: React.FC<ToolDetailsProps> = ({ tool, onAssemble }) => {
  return (
    <div>
      <h3>Komponen untuk {tool.name}</h3>
      <ul>
        {tool.components.map((component, index) => (
          <li key={index}>
            {component.name} - Stok: {component.stock}
          </li>
        ))}
      </ul>
      <button onClick={onAssemble} disabled={tool.components.some((c) => c.stock === 0)}>
        Buat Alat
      </button>
    </div>
  );
};

export default ToolDetails;
