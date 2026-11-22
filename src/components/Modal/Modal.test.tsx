import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Modal from './Modal';

function Host({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button data-testid="opener" onClick={() => setOpen(true)}>
        abrir
      </button>
      {open && (
        <Modal
          labelledBy="m-title"
          onClose={() => {
            onClose();
            setOpen(false);
          }}
        >
          <h2 id="m-title">Título</h2>
          <button data-testid="first">primero</button>
          <button data-testid="last">último</button>
        </Modal>
      )}
    </>
  );
}

describe('Modal', () => {
  it('expone role, aria-modal y aria-labelledby', () => {
    render(
      <Modal labelledBy="m-title" onClose={() => {}}>
        <h2 id="m-title">Título</h2>
      </Modal>,
    );
    const dialog = screen.getByTestId('modal-dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'm-title');
    expect(dialog).toHaveFocus();
  });

  it('Escape llama a onClose', () => {
    const onClose = vi.fn();
    render(
      <Modal labelledBy="m-title" onClose={onClose}>
        <h2 id="m-title">Título</h2>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('el clic en el fondo llama a onClose pero no el clic dentro', () => {
    const onClose = vi.fn();
    render(
      <Modal labelledBy="m-title" onClose={onClose}>
        <h2 id="m-title">Título</h2>
      </Modal>,
    );
    fireEvent.mouseDown(screen.getByTestId('modal-dialog'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByTestId('modal-dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('al cerrar devuelve el foco al botón que lo abrió y restaura el scroll', async () => {
    const user = userEvent.setup();
    render(<Host />);
    await user.click(screen.getByTestId('opener'));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('modal-dialog')).toBeNull();
    expect(screen.getByTestId('opener')).toHaveFocus();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('Tab y Shift+Tab permanecen dentro', async () => {
    const user = userEvent.setup();
    render(<Host />);
    await user.click(screen.getByTestId('opener'));
    screen.getByTestId('last').focus();
    await user.tab();
    expect(screen.getByTestId('first')).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByTestId('last')).toHaveFocus();
  });
});
