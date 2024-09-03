import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import { FormError, InputHint } from 'components/common/Input/Input.styled';
import { ErrorMessage } from '@hookform/error-message';

interface CheckboxProps {
  name: string;
  label: React.ReactNode;
  hint?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void; // Add onChange prop
}

const Checkbox: React.FC<CheckboxProps> = ({ name, label, hint, checked, onChange}) => {
  const { register } = useFormContext();

  return (
    <div>
      <InputLabel>
        <input {...register && register(name)} type="checkbox" checked={checked} onChange={onChange ? (e) => onChange(e.target.checked) : undefined} />
        {label}
      </InputLabel>
      <InputHint>{hint}</InputHint>
      <FormError>
        <ErrorMessage name={name} />
      </FormError>
    </div>
  );
};

export default Checkbox;
