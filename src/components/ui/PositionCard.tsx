import { Link } from "react-router-dom";

interface PositionCardProps {
  title: string;
  description: string;
  positions: string[];
}

export function PositionCard({
  title,
  description,
  positions
}: PositionCardProps) {
  return (
    <Link to="/apply" className="block p-5 rounded-md border border-border bg-card hover:border-primary/40 transition-colors">
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <ul className="space-y-1 text-sm text-foreground">
        {positions.map(position => (
          <li key={position}>— {position}</li>
        ))}
      </ul>
      
      <p className="mt-3 text-sm text-primary">Apply →</p>
    </Link>
  );
}