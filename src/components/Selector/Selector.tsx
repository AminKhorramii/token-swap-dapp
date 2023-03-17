import React, { ChangeEventHandler, HTMLAttributes} from 'react';

interface ISelectorProps {
    options: Array<any>,
    baseText: string,
    onOptionClicked: ChangeEventHandler<HTMLSelectElement>
};


const Selector = ({ baseText, options, onOptionClicked }: ISelectorProps & HTMLAttributes<HTMLSelectElement>) => {
    return (
        <select className="select select-accent w-full max-w-xs" defaultValue={baseText} onChange={onOptionClicked}>
            <option disabled>{baseText}</option>
            {
                options.map((option, index) => (
                    <option key={index} value={JSON.stringify(option)}>
                        {option.symbol}
                    </option>))
            }
        </select>
    );
};

export default Selector;