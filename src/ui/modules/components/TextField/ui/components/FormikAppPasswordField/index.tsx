import { FormikAppTextFieldProps } from '../FormikAppTextField';
import { useFormikAppTextField } from '../../../common';
import { AppPasswordField } from '../AppPasswordField';

export type FormikAppPasswordFieldProps = FormikAppTextFieldProps;

export const FormikAppPasswordField = (props: FormikAppPasswordFieldProps) => {
  const { validateBeforeTouch, ...rest } = props;
  const { field, handleChange, hasError, errorMessage } = useFormikAppTextField(
    { validateBeforeTouch, ...rest }
  );

  return (
    <AppPasswordField
      {...field}
      {...rest}
      onChange={handleChange}
      error={hasError}
      errorMessage={errorMessage}
    />
  );
};
