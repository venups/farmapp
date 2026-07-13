import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  is_packed: boolean;
  is_essential: boolean;
}

interface PackingItemRowProps {
  item: PackingItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PackingItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
}: PackingItemRowProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-600">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
            item.is_packed
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-slate-500 text-transparent hover:border-indigo-500'
          }`}
        >
          <div
            className={`w-full h-full bg-current rounded flex items-center justify-center ${
              item.is_packed ? 'opacity-100' : 'opacity-0 hover:opacity-100'
            }`}
          >
            <span className="text-[8px] text-white font-bold">✓</span>
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`font-medium truncate transition-all ${
              item.is_packed ? 'text-slate-500 line-through' : 'text-slate-200'
            }`}
          >
            {item.name}
          </p>
        </div>

        <span className="text-sm text-slate-400 min-w-[3rem]">
          {item.quantity}x
        </span>

        {item.is_essential && (
          <Badge variant="danger" size="sm">
            Essential
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-indigo-500/10"
          title="Edit item"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
