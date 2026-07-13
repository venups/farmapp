import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import PackingItemRow from './PackingItemRow';
import Badge from '../common/Badge';
import { PACKING_CATEGORIES, PackingItem } from '@/types';

interface PackingCategoryProps {
  category: string;
  items: PackingItem[];
  onToggle: (id: string) => void;
  onEdit: (item: PackingItem) => void;
  onDelete: (id: string) => void;
}

export default function PackingCategory({
  category,
  items,
  onToggle,
  onEdit,
  onDelete,
}: PackingCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  const getCategoryInfo = () => {
    return PACKING_CATEGORIES.find((c) => c.value === category);
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {categoryInfo ? (
            <span className="text-xl">{categoryInfo.emoji}</span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs">?</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-200">
              {categoryInfo ? categoryInfo.label : category}
            </h3>
            <p className="text-sm text-slate-400">
              {items.filter((i) => i.is_packed).length}/{items.length} packed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50 pt-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No items in this category</p>
            </div>
          ) : (
            items.map((item) => (
              <PackingItemRow
                key={item.id}
                item={item}
                onToggle={() => onToggle(item.id)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
