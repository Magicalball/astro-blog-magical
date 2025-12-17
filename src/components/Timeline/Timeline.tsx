import { useState, useRef } from 'preact/hooks';
import TimelineItem from './TimelineItem';
import EventModal from './EventModal';
import './timeline.css';

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  content: string;
  tags?: string[];
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({ events, className = '' }: TimelineProps) {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<DOMRect | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleCardClick = (eventId: string, cardElement: HTMLDivElement) => {
    const rect = cardElement.getBoundingClientRect();
    setModalPosition(rect);
    setActiveModalId(eventId);
  };

  const handleCloseModal = () => {
    setActiveModalId(null);
    setModalPosition(null);
  };

  const activeEvent = events.find(e => e.id === activeModalId);

  return (
    <div className={`timeline-container ${className}`}>
      <div className="timeline-line"></div>
      {events.map((event) => (
        <TimelineItem
          key={event.id}
          event={event}
          onCardClick={(cardElement) => handleCardClick(event.id, cardElement)}
          cardRef={(el) => {
            if (el) cardRefs.current.set(event.id, el);
            else cardRefs.current.delete(event.id);
          }}
        />
      ))}
      {activeEvent && modalPosition && (
        <EventModal
          event={activeEvent}
          initialPosition={modalPosition}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
