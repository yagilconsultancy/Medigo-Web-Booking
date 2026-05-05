import { FormikAppTextFieldProps } from '../../../ui/components/FormikAppTextField';
import { useField } from 'formik';
import { ChangeEvent } from 'react';

export const useFormikAppTextField = ({
  validateBeforeTouch,
  ...props
}: FormikAppTextFieldProps) => {
  const [field, meta] = useField(props.name as string);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    // We allow any custom value transformation before validation
    props.onChange?.(event);
    field.onChange(event);
  };

  const hasError = !!((validateBeforeTouch || meta.touched) && meta.error);
  const errorMessage =
    (validateBeforeTouch || meta.touched) && meta.error
      ? meta.error
      : undefined;

  return {
    field,
    handleChange,
    hasError,
    errorMessage,
  };
};
