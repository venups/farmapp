import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { PackingCategory } from '@/components/packing/PackingCategory';
import { PackingForm } from '@/components/packing/PackingForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PACKING_CATEGORIES } from '@/types';
import type { PackingItem, PackingListResponse } from '@/types';
import toast from 'react-hot-toast';

export function PackingPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [packingData, setPackingData] = useState<PackingListResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/packing/trip/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setPackingData(await res.json());
      } catch {
        // API not available
      }
    };
    fetchData();
  }, [tripId]);

  const handleCreateItem = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/packing/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setShowForm(false);
        toast.success('Item added!');
      }
    } catch {
      toast.error('Failed to add item');
    }
  };

  const handleUpdateItem = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/packing/${editingItem?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEditingItem(null);
        setShowForm(false);
        toast.success('Item updated!');
      }
    } catch {
      toast.error('Failed to update item');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/packing/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Item toggled');
    } catch {
      toast.error('Failed to toggle item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/packing/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDelete(null);
      toast.success('Item deleted');
    } catch {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Packing List</h1>
          {packingData && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {packingData.packed_items} of {packingData.total_items} items packed
            </p>
          )}
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} icon={<Plus size={16} />}>Add Item</Button>
      </div>

      {packingData && (
        <ProgressBar value={packingData.progress_percent} showLabel size="md" style={{ marginBottom: 24 }} />
      )}

      {packingData && Object.entries(packingData.by_category).map(([category, items]) => {
        const catInfo = PACKING_CATEGORIES.find((c) => c.value === category);
        return (
          <PackingCategory
            key={category}
            category={catInfo?.label || category}
            items={items as PackingItem[]}
            emoji={catInfo?.emoji || '📦'}
            onToggle={handleToggle}
            onEdit={(item) => { setEditingItem(item); setShowForm(true); }}
            onDelete={(id) => setShowDelete(id)}
          />
        );
      })}

      {!packingData?.items?.length && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>
          No items yet. Start adding things to your packing list!
        </div>
      )}

      <PackingForm
        tripId={tripId!}
        initialData={editingItem ? { ...editingItem, category: editingItem.category } : undefined}
        onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
        isLoading={false}
        onCancel={() => { setShowForm(false); setEditingItem(null); }}
        isOpen={showForm}
      />

      <ConfirmDialog
        isOpen={showDelete !== null}
        onClose={() => setShowDelete(null)}
        onConfirm={() => showDelete && handleDeleteItem(showDelete)}
        title="Delete Item"
        message="Remove this item from your packing list?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
