import classNames from 'classnames'
import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { GoArrowUp } from 'react-icons/go'
import { MdOutlineClose } from 'react-icons/md'

const Dropzone = forwardRef((props, ref) => {
  const [myFiles, setMyFiles] = useState([])
  const { setValue, register, errors, clearErrors } = props

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles])
      setValue('image', acceptedFiles)
      clearErrors('image')
    },
    [myFiles]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop,
  })

  const handleResetFile = () => {
    setValue('image', null)
    setMyFiles([])
  }

  return (
    <div
      className={classNames(
        'relative flex h-full items-center overflow-hidden rounded-lg bg-gray-100 p-4',
        {
          'bg-gray-100': !errors.image,
          'bg-red-100 border-red-500': errors.image,
        }
      )}
    >
      {myFiles[0] ? (
        <>
          <button
            onClick={handleResetFile}
            type="button"
            className="absolute top-5 right-5 aspect-square rounded-full bg-gray-600 p-1 text-white"
          >
            <MdOutlineClose />
          </button>
          <img src={URL.createObjectURL(myFiles[0])} />
        </>
      ) : (
        ''
      )}
      <div
        {...getRootProps()}
        className={classNames(
          'flex h-full w-full flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed outline-none',
          {
            'hover:cursor-pointer':!myFiles[0],
            'hidden': myFiles[0],
            'border-gray-300': !errors.image,
            'border-red-300': errors.image,
          }
        )}
      >
        <input
          ref={ref}
          {...getInputProps()}
          {...register('image', {
            required: 'An image is required to create a pin',
          })}
        />
        {errors.image ? (
          <>
            <span className="flex aspect-square flex-col items-center justify-center rounded-full bg-red-700 p-1 text-3xl font-bold text-white">
              !
            </span>
            <p className="text-center text-red-900">
              Image is required to create a pin
            </p>
          </>
        ) : (
          <>
            <span className="aspect-square rounded-full bg-gray-700 p-1 text-3xl text-white">
              <GoArrowUp />
            </span>
            <p className="text-center">
              Drag 'n' drop or click to select files
            </p>
          </>
        )}
      </div>
    </div>
  )
})

export default Dropzone
