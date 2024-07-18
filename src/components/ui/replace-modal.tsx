'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReplaceModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Replace File"
      description="You are about to replace the current file."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button size="sm" variant="outline" onClick={onClose} className='h-8 text-xs md:text-sm'>
          Cancel
        </Button>
        <Button size="sm" variant="destructive" onClick={onConfirm} className='h-8 text-xs md:text-sm'>
          Proceed
        </Button>
      </div>
    </Modal>
  );
};
