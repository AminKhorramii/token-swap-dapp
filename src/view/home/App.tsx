import React from 'react';
import Modal from '../../components/Modal/Modal';
import './App.css';

function App() {
  return (
    <div className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Hello there</h1>
        <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
        <label htmlFor="my-modal-6" className="btn">open modal</label>
        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <Modal>
          <div>Aggregator</div>
        </Modal>
      </div>
    </div>
  </div>
  );
}

export default App;
