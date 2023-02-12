import axios from 'axios'
import classNames from 'classnames'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Dropzone from '../components/Dropzone'
import Loader from '../components/Loader'
import Template from '../components/Template'
import UserContext from '../contexts/UserContext'
import { removeHttps } from '../helpers'
import { cloudName, uploadPreset } from '../lib/cloudinary'
import { db } from '../lib/firebase'

export default function Create() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    getValues,
    setError,
  } = useForm()

  useEffect(() => {}, [])

  const onSubmit = async (data) => {
    if (!data.image) {
      setError('image', {
        type: 'required',
        message: 'Image is required to create a pin',
      })
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', data.image[0])
    formData.append('upload_preset', uploadPreset)
    let cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    )
    let publicId = cloudinaryRes.data.public_id

    await addDoc(collection(db, 'pins'), {
      title: data.title,
      description: data.description,
      destinationLink: removeHttps(data.destinationLink),
      publicId,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
    })

    return navigate('/')
  }

  return (
    <Template>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex h-[calc(100vh-72px)] justify-center bg-gray-100 lg:py-10`}
      >
        <div className="relative flex min-h-full w-full flex-col gap-y-4 overflow-auto bg-white p-5 shadow lg:mx-5 lg:w-[900px] lg:overflow-hidden lg:rounded-xl lg:p-10">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-black/30">
              <Loader />
            </div>
          )}
          <button
            type="submit"
            className="ml-auto rounded-lg bg-red-500 px-4 py-2 font-bold text-white outline-none duration-300 hover:scale-110 hover:bg-red-600 active:scale-100"
          >
            Save
          </button>
          <div className="flex h-full flex-col gap-4 lg:flex-row">
            <div className="h-full flex-grow lg:w-1/2">
              <Dropzone
                {...{ setValue, errors, clearErrors }}
                {...register('image', {
                  required: 'Image is required to create a pin',
                })}
              />
            </div>
            <div className="flex h-full flex-grow flex-col gap-y-2">
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className={classNames(
                  'w-full border-b py-2 text-4xl font-extrabold outline-none placeholder:font-extrabold focus:border-b-2',
                  {
                    'focus:border-b-blue-400': !errors.title,
                    'placeholder:text-red-200 focus:border-b-red-400':
                      errors.title,
                  }
                )}
                placeholder="Add your title"
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
              <div className="my-6 flex items-center gap-x-4">
                <img
                  src={user.photoURL}
                  className="aspect-square h-12 rounded-full"
                />
                <span className="font-bold">{user.displayName}</span>
              </div>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                })}
                cols="30"
                rows="2"
                className={classNames(
                  'w-full border-b p-4 outline-none placeholder:font-extrabold focus:border-b-2',
                  {
                    'focus:border-b-blue-400': !errors.title,
                    'placeholder:text-red-200 focus:border-b-red-400':
                      errors.title,
                  }
                )}
                placeholder="Tell everyone what your Pin is about 😀"
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
              <input
                {...register('destinationLink')}
                type="text"
                className="mt-auto mb-4 w-full border-b py-2 outline-none placeholder:font-extrabold focus:border-b-2 focus:border-b-blue-400"
                placeholder="Add a destination link"
              />
            </div>
          </div>
        </div>
      </form>
    </Template>
  )
}
