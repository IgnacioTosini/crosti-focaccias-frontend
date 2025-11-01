import { useEffect } from 'react';
import './_modal.scss';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    imageSrc?: string;
}

export const Modal = ({ isOpen, onClose, imageSrc }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <button className="modalClose" onClick={onClose}>
                    ✕
                </button>
                {imageSrc && (
                    <div className="modalImageContainer">
                        <img src={imageSrc} alt="Imagen" className="modalImage" />
                    </div>
                )}
            </div>
        </div>
    );
};