// Compress image to 248x248 using canvas
export default async function compressImage(file: Blob): Promise<Blob> {
  if (!/image/i.test(file.type)) {
    alert('File ' + file.name + ' is not an image.')
    throw new Error('File ' + file.name + ' is not an image.')
  }

  const img = await createImageBitmap(file)

  const canvas = document.createElement('canvas')
  canvas.width = 248
  canvas.height = 248

  const context = canvas.getContext('2d')
  // TODO: resize so shape iss not deformed maybe bonus

  const MIME_TYPE = 'image/jpeg'
  const QUALITY = 0.7

  context?.drawImage(img, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
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
  })
}
