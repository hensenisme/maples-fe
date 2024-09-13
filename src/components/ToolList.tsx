// src/components/ToolList.tsx
import React from 'react';
import { Tool } from '../data/toolsData';

type ToolListProps = {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
};

const ToolList: React.FC<ToolListProps> = ({ tools, onSelectTool }) => {
  return (
    <div>
      <h2>Pilih Alat</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.id}>
            <button onClick={() => onSelectTool(tool)}>{tool.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolList;
