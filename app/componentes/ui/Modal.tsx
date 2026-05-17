import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, icon }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary/20">
          {icon && <div className="text-primary text-2xl">{icon}</div>}
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
