// components/modals/AutoSubmitWarningModal.tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AutoSubmitWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AutoSubmitWarningModal: React.FC<AutoSubmitWarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Cảnh báo rời khỏi trang
          </DialogTitle>
          <DialogDescription className="text-left pt-2 space-y-2">
            <p>
              Bạn đang cố gắng rời khỏi trang hoặc chuyển sang tab khác trong khi làm bài thi.
            </p>
            <p className="font-semibold text-yellow-500">
              Hành động này sẽ được coi là gian lận và bài làm của bạn sẽ tự động được nộp.
            </p>
            <p>
              Bạn có chắc chắn muốn tiếp tục không?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-[100px]"
          >
            Ở lại
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-[100px]"
          >
            Nộp bài
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoSubmitWarningModal;