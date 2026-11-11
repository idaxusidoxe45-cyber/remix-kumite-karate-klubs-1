import { useEffect, useRef, type PointerEvent } from 'react';

/**
 * Coordinates React `isOpen` state with a native `<dialog>` element opened via `showModal()`.
 * Provides native Esc/Android back handling, `closedby="any"` progressive enhancement,
 * and safe outside-backdrop pointer dismissal without mutating body scroll styles.
 */
export function useDialogModal(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const pointerStartedOutsideRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.setAttribute('closedby', 'any');

    const handleClose = () => {
      onCloseRef.current();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const isOutsideDialog = (e: PointerEvent<HTMLDialogElement>, dialog: HTMLDialogElement) => {
    if (e.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    );
  };

  const handlePointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    pointerStartedOutsideRef.current = isOutsideDialog(e, dialog);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const endedOutside = isOutsideDialog(e, dialog);
    if (pointerStartedOutsideRef.current && endedOutside) {
      onCloseRef.current();
    }
    pointerStartedOutsideRef.current = false;
  };

  return {
    dialogRef,
    dialogProps: {
      ref: dialogRef,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  };
}
