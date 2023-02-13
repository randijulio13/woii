import React from 'react'
import Modal from './Modal'

export default function DeletePinModal({
  isOpen,
  closeModal,
  handleDeletePin,
}) {
  return (
    <Modal {...{ isOpen, closeModal }}>
      <Modal.Title>Delete PIN?</Modal.Title>
      <Modal.Body className="mt-4">
        <span>
          This action cannot be undone. Are you sure you want to delete this
          PIN?
        </span>
        <div className="mt-4 flex gap-x-4">
          <button
            onClick={handleDeletePin}
            className="rounded-lg bg-red-500 px-4 py-2 text-white outline-none duration-300 hover:scale-110 hover:bg-red-600 active:scale-100 active:bg-red-500"
          >
            Delete
          </button>
          <button
            className="rounded-lg bg-white px-4 py-2 outline-none duration-300 hover:scale-110 hover:bg-gray-100 active:scale-100 active:bg-white"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
