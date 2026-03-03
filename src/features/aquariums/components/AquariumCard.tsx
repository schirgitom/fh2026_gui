import { Link } from 'react-router-dom';
import { Aquarium } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

interface AquariumCardProps {
  aquarium: Aquarium;
  onEdit: (aquarium: Aquarium) => void;
  onDelete: (aquarium: Aquarium) => void;
}

export const AquariumCard = ({ aquarium, onEdit, onDelete }: AquariumCardProps) => (
  <div className="card flex h-full flex-col gap-4 p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-ink-900">{aquarium.name}</h3>
        <p className="text-sm text-ink-500">{aquarium.volumeLiters} L</p>
      </div>
      <Badge
        label={aquarium.type === 'freshwater' ? 'Freshwater' : 'Seawater'}
        variant={aquarium.type === 'freshwater' ? 'info' : 'success'}
      />
    </div>
    {aquarium.description && <p className="text-sm text-ink-600">{aquarium.description}</p>}
    <div className="mt-auto flex flex-wrap gap-3">
      <Link to={`/aquariums/${aquarium.id}`} className="flex-1">
        <Button className="w-full">Open</Button>
      </Link>
      <Button variant="secondary" className="flex-1" onClick={() => onEdit(aquarium)}>
        Edit
      </Button>
      <Button variant="ghost" className="flex-1" onClick={() => onDelete(aquarium)}>
        Delete
      </Button>
    </div>
  </div>
);
