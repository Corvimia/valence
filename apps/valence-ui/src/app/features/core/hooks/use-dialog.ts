import { useState } from "react";


export const useDialog = (onClose: () => void): [boolean, () => void, () => void] => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeDialog = () => {
    onClose();
    setDialogOpen(false);
  };
  const openDialog = () => setDialogOpen(true);
  return [dialogOpen, openDialog, closeDialog];
}
