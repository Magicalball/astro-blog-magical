import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import type { TimelineEvent } from './Timeline';

interface EventModalProps {
  event: TimelineEvent;
  initialPosition: DOMRect;
  onClose: () => void;
}

export default function EventModal({
  event,
  initialPosition,
  onClose
}: EventModalProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialPositionRef = useRef(initialPosition);

  const handleClose = useCallback(() => {
    const modal = modalRef.current;
    if (!modal) {
      onClose();
      return;
    }

    modal.style.transition = 'transform 200ms ease, opacity 200ms ease';
    modal.style.transform = 'translate(-50%, -50%) scale(0.92)';
    modal.style.opacity = '0';

    setTimeout(() => {
      onClose();
      document.body.style.overflow = '';
    }, 300);
  }, [onClose]);

  useEffect(() => {
    initialPositionRef.current = initialPosition;

    const modal = modalRef.current;
    if (!modal) return;

    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modal.style.opacity = '0';
    modal.style.transition = 'none';
    modal.style.zIndex = '1001';

    void modal.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.style.transition =
          'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
        modal.style.opacity = '1';

        setTimeout(() => {
          setIsAnimating(false);
        }, 250);
      });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [initialPosition, handleClose]);

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}></div>
      <div
        ref={modalRef}
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          aria-label="关闭弹窗"
        >
          ×
        </button>
        <h2 id="modal-title" className="modal-title">{event.title}</h2>
        <p className="modal-description">{event.description}</p>
        <div
          className="modal-content"
          dangerouslySetInnerHTML={{ __html: event.content }}
        ></div>
      </div>
    </>
  );
}

