import React from 'react';

interface IModalProps {
    children: React.ReactNode;
};

const Modal = ({ children }: IModalProps) => {
    return (
        <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                {children}
                <div className="modal-action">
                    <label htmlFor="my-modal-6" className="btn">Yay!</label>
                </div>
            </div>
        </div>
    );
};

export default Modal;