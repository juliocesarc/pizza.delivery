"use client";

import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";

interface ModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    description,
    children,
    onClose,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl w-full">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};
