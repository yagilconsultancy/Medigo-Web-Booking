import { useState } from 'react';

export const useAppPasswordField = () => {
  const [obscurePassword, setObscurePassword] = useState(true);

  const handleVisibilityButtonClicked = () => {
    setObscurePassword(!obscurePassword);
  };

  return {
    obscurePassword,
    handleVisibilityButtonClicked,
  };
};
