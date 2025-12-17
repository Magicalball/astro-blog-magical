import { useEffect, useRef } from 'preact/hooks';
import type { TimelineEvent } from './Timeline';

interface EventCardProps {
  event: TimelineEvent;
  onClick: (cardElement: HTMLDivElement) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

export default function EventCard({
  event,
  onClick,
  cardRef
}: EventCardProps) {
  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardElementRef.current) {
      cardRef(cardElementRef.current);
    }
  }, [cardRef]);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cardElementRef.current) {
      onClick(cardElementRef.current);
    }
  };

  return (
    <div
      ref={cardElementRef}
      className="event-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`查看 ${event.title} 的详细信息`}
    >
      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-description">{event.description}</p>
    </div>
  );
}
