import React, { HTMLAttributes, ChangeEventHandler } from 'react';

interface IInputProps {
    inputValue: string
    onInputChanged: ChangeEventHandler<HTMLInputElement>
    disabled?: boolean
    readonly?: boolean
};

const Input = ({disabled,  inputValue, onInputChanged, placeholder }: IInputProps & HTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            min="1"
            disabled={disabled}
            value={inputValue}
            type="number"
            onChange={onInputChanged}
            placeholder={placeholder}
            className="input input-bordered input-secondary w-full max-w-xs" />
    );
};

export default Input;