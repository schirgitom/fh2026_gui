import { Coral } from '@/shared/types';
import { Button } from '@/shared/ui/Button';

interface CoralTableProps {
  items: Coral[];
  onEdit: (coral: Coral) => void;
  onDelete: (coral: Coral) => void;
}

export const CoralTable = ({ items, onEdit, onDelete }: CoralTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Species</th>
          <th className="px-6 py-3">Quantity</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((coral) => (
          <tr key={coral.id} className="border-t border-ink-100">
            <td className="px-6 py-4 font-medium text-ink-800">{coral.name}</td>
            <td className="px-6 py-4 text-ink-600">{coral.species}</td>
            <td className="px-6 py-4 text-ink-600">{coral.quantity}</td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onEdit(coral)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(coral)}>
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
