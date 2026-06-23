export interface ModalProps {
  isOpen: boolean;
  venueId: number;
  description: string;
  onClose: () => void;
}
