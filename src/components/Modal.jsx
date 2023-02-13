import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'

function Modal({ isOpen, closeModal, children, sm, md, lg }) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 scale-0"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-0"
              >
                <Dialog.Panel
                  className={classNames(
                    'w-full transform overflow-hidden rounded-3xl bg-white px-8 py-6 text-left align-middle shadow-xl transition-all',
                    {
                      'max-w-lg': md,
                      'max-w-2xl': lg,
                      'max-w-md': sm,
                      'max-w-sm': !md && !lg && !sm,
                    }
                  )}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

function ModalTitle({ children, className }) {
  return (
    <Dialog.Title
      as="h3"
      className={`${className} text-lg font-medium leading-6 text-gray-900`}
    >
      {children}
    </Dialog.Title>
  )
}

function ModalBody({ children, className }) {
  return <div {...{ className }}>{children}</div>
}

Modal.Title = ModalTitle
Modal.Body = ModalBody
export default Modal
