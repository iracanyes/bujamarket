import * as React from "react";
import {
  Button,
  useUpdateMany,
  useRefresh,
  useNotify,
  useUnselectAll,
} from 'react-admin';
import { VisibilityOff } from '@material-ui/icons';
import { toast } from "react-toastify";

const ValidateButton = ({ label, selectedIds }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const unselectAll = useUnselectAll();
  const [updateMany, { loading }] = useUpdateMany(
    'categories',
    selectedIds,
    { isValid: true },
    {
      onSuccess: () => {
        refresh();
        toast('Catégories mis à jour');
        unselectAll('categories');
      },
      onFailure: error => toast.warning('Erreur: Catégories non mis à jour'),
    }
  );

  return (
    <Button
      label={label}
      disabled={loading}
      onClick={updateMany}
    >
      <VisibilityOff />
    </Button>
  );
};

export default ValidateButton;
