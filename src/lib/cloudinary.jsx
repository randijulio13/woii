import { Cloudinary } from '@cloudinary/url-gen'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
})

const linkGenerate = (publicId, width) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill${
    width ? ',w_' + width : ''
  }/${publicId}`
}

export default cld

export { cloudName, uploadPreset, linkGenerate }
