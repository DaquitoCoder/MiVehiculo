import React, { useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  name,
  control,
}) => {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div className='space-y-2'>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className='relative'>
            {!isCustom ? (
              <Select
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustom(true);
                    field.onChange('');
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecciona una opción' />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  <SelectItem value='custom'>
                    Ingresar valor personalizado
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                type='text'
                id={name}
                {...field}
                className='w-full pr-10'
                placeholder='Ingresa un valor personalizado'
              />
            )}
            {isCustom && (
              <button
                type='button'
                onClick={() => {
                  setIsCustom(false);
                  field.onChange('');
                }}
                className='absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700'
                aria-label='Volver a las opciones predefinidas'
              >
                ✕
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};
