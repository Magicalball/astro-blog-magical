import EventCard from './EventCard';
import type { TimelineEvent } from './Timeline';

interface TimelineItemProps {
  event: TimelineEvent;
  onCardClick: (cardElement: HTMLDivElement) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

export default function TimelineItem({
  event,
  onCardClick,
  cardRef
}: TimelineItemProps) {
  return (
    <div className="timeline-item">
      <div className="timeline-node"></div>
      <div className="timeline-date">
        {event.date} {event.time && ` ${event.time}`}
      </div>
      <EventCard
        event={event}
        onClick={onCardClick}
        cardRef={cardRef}
      />
    </div>
  );
}
