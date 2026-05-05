'use client';

import React from 'react';
import { useField } from 'formik';
import { ColorPicker } from '../ColorPicker';

export type FormikColorPickerProps = {
  name: string;
  label?: string;
};

export const FormikColorPicker: React.FC<FormikColorPickerProps> = ({
  name,
  label,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (color: string) => {
    helpers.setValue(color);
    helpers.setTouched(true);
  };

  return (
    <ColorPicker
      value={field.value}
      onChange={handleChange}
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};
