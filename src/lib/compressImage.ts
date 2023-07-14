// Compress image to 248x248 using canvas
export default async function compressImage(file: Blob): Promise<Blob> {
  if (!/image/i.test(file.type)) {
    alert('File ' + file.name + ' is not an image.')
    throw new Error('File ' + file.name + ' is not an image.')
  }

  const blobURL = window.URL.createObjectURL(file)
  const img = new Image()
  img.src = blobURL

  const canvas = document.createElement('canvas')
  canvas.width = 248
  canvas.height = 248

  const context = canvas.getContext('2d')

  const MIME_TYPE = 'image/jpeg'
  const QUALITY = 0.7

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context?.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas is empty'))
          }
        },
        MIME_TYPE,
        QUALITY,
      )
    }
  })
}
