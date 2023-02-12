const removeHttps = (url) => {
  return url.replace(/^https?:\/\//, '')
}

const destinationLink = (url, urlLength = 10) => {
  let link = url.replace(/^https?:\/\//, '')
  let dots = urlLength === link.length ? '' : '...'
  link = link.slice(0, urlLength)
  return link + dots
}

const getImgMeta = (url, cb) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = url
  })
}

export { destinationLink, removeHttps, getImgMeta }
