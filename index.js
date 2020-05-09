(async () => {
  const Jimp = require('jimp')
  const math = require('mathjs')

  const white = 0xFFFFFFFF
  function blackImage() {
    return new Jimp(200, 200, 'black', (err) => {
      if (err) throw err
    })
  }

  // QUESTAO 1
  const imgQ1 = blackImage()
  for (const { x, y } of imgQ1.scanIterator(0, 0, 200, 200)) {
    const [a, b] = [x / 100 - 1, y / 100 - 1]
    const halfPixel = 2 / 200 / 2

    function F(x, y) { return x * x + y * y - 1 }

    const f1 = F(a - halfPixel, b - halfPixel)
    const f2 = F(a - halfPixel, b + halfPixel)
    const f3 = F(a + halfPixel, b + halfPixel)
    const f4 = F(a + halfPixel, b - halfPixel)

    if (f1 * f2 < 0 || f2 * f3 < 0 || f3 * f4 < 0 || f4 * f1 < 0) {
      imgQ1.setPixelColor(white, x, y)
    }
  }
  imgQ1.write('questao1.jpg')

  // QUESTAO 2a
  const imgQ2a = blackImage()
  let t = 0, dt = 0.1
  while (t < 100) {
    const [x, y] = [t * math.sin(t) + 100, t * math.cos(t) + 100]
    imgQ2a.setPixelColor(white, x, y)
    t += dt
  }
  imgQ2a.write('questao2a.jpg')

  // QUESTAO 2b
  const imgQ2b = blackImage()
  t = 0
  while (t < 100) {
    const [x, y] = [t * math.sin(t) + 100, t * math.cos(t) + 100]
    imgQ2b.setPixelColor(white, x, y)

    const dt = 1 / math.sqrt(t * t + 1)
    t += dt
  }
  imgQ2b.writeAsync('questao2b.jpg')

  // QUESTAO 3
  const imgQ3 = blackImage()
  for (const { x, y } of imgQ3.scanIterator(0, 0, 200, 200)) {
    const [a, b] = [x / 200, y / 200]
    const f1 = b - a
    const f2 = a * a + b * b - 1
    const f3 = (a - 1) * (a - 1) + (b - 1) * (b - 1) - 1

    if (f1 < 0 && f2 < 0 && f3 < 0) {
      imgQ3.setPixelColor(white, x, y)
    }
  }
  imgQ3.writeAsync('questao3.jpg')

  // QUESTAO 4
  const imgQ4 = blackImage()
  for (const { x, y } of imgQ4.scanIterator(0, 0, 200, 200)) {
    const [a, b] = [x / 50 - 2, y / 50 - 2]
    const halfPixel = 4 / 200 / 2

    function F(x, y) { return y * y - x * x * x + x }

    const f1 = F(a - halfPixel, b - halfPixel)
    const f2 = F(a - halfPixel, b + halfPixel)
    const f3 = F(a + halfPixel, b + halfPixel)
    const f4 = F(a + halfPixel, b - halfPixel)

    if (f1 * f2 < 0 || f2 * f3 < 0 || f3 * f4 < 0 || f4 * f1 < 0) {
      imgQ4.setPixelColor(white, x, y)
    }
  }
  imgQ4.writeAsync('questao4.jpg')

})()