'use client';

import { AppTextField, AppTextFieldProps } from '../AppTextField';
import { useFormikAppTextField } from '../../../common';

export type FormikAppTextFieldProps = AppTextFieldProps & {
  validateBeforeTouch?: boolean;
};

export const FormikAppTextField = (props: FormikAppTextFieldProps) => {
  const { validateBeforeTouch, ...rest } = props;
  const { field, handleChange, hasError, errorMessage } = useFormikAppTextField(
    { validateBeforeTouch, ...rest }
  );

  return (
    <AppTextField
      {...field}
      {...rest}
      onChange={handleChange}
      error={hasError}
      errorMessage={errorMessage}
    />
  );
};
