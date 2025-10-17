export async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { width, height, x, y } = croppedAreaPixels;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

  // ✅ Сразу в base64, без FileReader (самый стабильный способ)
  const base64 = canvas.toDataURL("image/jpeg", 0.95);

  // удаляем префикс "data:image/jpeg;base64," если бэкенд ожидает только чистую строку
  return base64.split(",")[1];
}

// helper для загрузки картинки
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}