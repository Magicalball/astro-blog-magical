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

    const current = modal.getBoundingClientRect();
    const target = initialPositionRef.current;

    modal.style.transition = 'transform 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 300ms ease, left 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19), top 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19), width 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19), height 300ms cubic-bezier(0.55, 0.055, 0.675, 0.19)';
    modal.style.left = `${target.left}px`;
    modal.style.top = `${target.top}px`;
    modal.style.width = `${target.width}px`;
    modal.style.height = `${target.height}px`;
    modal.style.transform = 'scale(0.8)';
    modal.style.opacity = '0';

    setTimeout(() => {
      onClose();
      document.body.style.overflow = '';
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 更新初始位置引用
    initialPositionRef.current = initialPosition;

    // 实现打开动画
    const modal = modalRef.current;
    if (!modal) return;

    // FLIP 动画逻辑
    const first = initialPosition;
    modal.style.position = 'fixed';
    modal.style.left = `${first.left}px`;
    modal.style.top = `${first.top}px`;
    modal.style.width = `${first.width}px`;
    modal.style.height = `${first.height}px`;
    modal.style.transform = 'scale(0.8)';
    modal.style.opacity = '0';
    modal.style.transition = 'none';
    modal.style.zIndex = '1001';

    // 强制重排
    void modal.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const modalRect = modal.getBoundingClientRect();
        const targetLeft = window.innerWidth / 2 - modalRect.width / 2;
        const targetTop = window.innerHeight / 2 - modalRect.height / 2;

        modal.style.transition = 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease, left 300ms cubic-bezier(0.34, 1.56, 0.64, 1), top 300ms cubic-bezier(0.34, 1.56, 0.64, 1), width 300ms cubic-bezier(0.34, 1.56, 0.64, 1), height 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        modal.style.left = `${targetLeft}px`;
        modal.style.top = `${targetTop}px`;
        modal.style.width = '';
        modal.style.height = '';
        modal.style.transform = 'scale(1)';
        modal.style.opacity = '1';
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      });
    });

    // 键盘事件
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // 防止背景滚动

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
        <div className="modal-content">{event.content}</div>
      </div>
    </>
  );
}

