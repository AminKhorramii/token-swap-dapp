import React from 'react';

interface IModalProps {
    children: React.ReactNode;
};

const Modal = ({ children }: IModalProps) => {
    return (
        <div className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <label htmlFor="modal-convertor" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                {children}
                <div className="modal-action">
                </div>
            </div>
        </div>
    );
};

export default Modal;