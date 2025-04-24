import { Menu, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const MenuButton = ({ isOpen, toggleMenu }: Props) => {
  return (
    <div className="z-50 md:hidden">
      <button onClick={toggleMenu} className="p-2">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default MenuButton;
