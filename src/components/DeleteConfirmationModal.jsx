import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  productId,
  title = 'Confirmar eliminación',
  message = '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
}) => {
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize='lg'
            fontWeight='bold'
          >
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              colorScheme='red'
              onClick={() => onConfirm(productId)}
              ml={3}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
// This component is a confirmation modal that can be used to confirm deletion actions.
// It uses Chakra UI's AlertDialog component to create a modal with a title, message, and two buttons: one for confirming the action and another for canceling it.
