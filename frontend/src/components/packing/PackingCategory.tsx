import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '../common/Card';
import type { PackingItem } from '@/types';

interface PackingCategoryProps {
  category: string;
  items: PackingItem[];
  emoji: string;
  onToggle: (id: string) => void;
  onEdit: (item: PackingItem) => void;
  onDelete: (id: string) => void;
}

export function PackingCategory({ category, items, emoji, onToggle, onEdit, onDelete }: PackingCategoryProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 16px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-text-primary)', fontSize: 14, fontWeight: 600 }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        <span>{emoji} {category}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-secondary)' }}>{items.length} items</span>
      </button>
      {!collapsed && (
        <div style={{ marginTop: 8 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <input
                type="checkbox"
                checked={item.is_packed}
                onChange={() => onToggle(item.id)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <div style={{ flex: 1, textDecoration: item.is_packed ? 'line-through' : 'none', opacity: item.is_packed ? 0.5 : 1 }}>
                <span style={{ fontSize: 14 }}>{item.name}</span>
                {item.quantity > 1 && <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}> x{item.quantity}</span>}
                {item.is_essential && <span style={{ marginLeft: 8, fontSize: 10, backgroundColor: 'rgba(239,68,68,0.2)', color: '#F87171', padding: '2px 6px', borderRadius: 4 }}>ESSENTIAL</span>}
              </div>
              <button onClick={() => onEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Edit">✏️</button>
              <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Delete">🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
