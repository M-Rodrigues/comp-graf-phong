function Sphere(v, r) {
  return {
    center: v, r: r
  }
}

(async () => {
  const Jimp = require('jimp')

  const Config = require('./utils/config')
  const LightModel = require('./utils/light')
  const LinAlg = require('./utils/lin_alg')
  const Algebra = require('./utils/algebra')

  function get_pixel_color(camera, ray_direction, sphere) {
    // Calcular ponto de intersecao do raio que chega na camera com a esfera
    const p = LightModel.ray_intersection_sphere(camera, ray_direction, sphere)

    // Se tiver ponto de intersecao com a esfera
    if (!p) return false
    
    // Reflexao de Phong
    const color = LightModel.phong(p, sphere, Config)

    // Colocar a cor no intervalo [0, 255]
    function convert_color(c) {
      return Math.max(0, Math.min(255, Math.round(c)))
    }

    // Colorir o pixel
    return Jimp.rgbaToInt(
      convert_color(color.R),
      convert_color(color.G),
      convert_color(color.B),
      255
    )
  }

  // Carregando objetos da cena
  const objects = []
  const dl = [-1, 0, 1]
  for (const dx of dl) {
    for (const dy of dl) {
      objects.push(Sphere(LinAlg.vector(dx, dy, -2), 0.3))
      objects.push(Sphere(LinAlg.vector(dx, dy, -1), 0.3))
      objects.push(Sphere(LinAlg.vector(dx, dy, 0), 0.3))
    }
  }

  // Criando imagem
  const img = new Jimp(Config.image_resolution.W, Config.image_resolution.H, (err) => {
    if (err) throw err
  });

  // Varrendo cada pixel da imagem final
  for (const { x, y } of img.scanIterator(0, 0, img.bitmap.width, img.bitmap.height)) {
    // Converter ponto da imagem para ponto na tela da cena
    const p_screen = LinAlg.vector(
      Algebra.linear(0, img.bitmap.width, -Config.screen.W / 2, Config.screen.W / 2, x),
      Algebra.linear(0, img.bitmap.height, Config.screen.H / 2, -Config.screen.H / 2, y),
      Config.screen.z_position
    )
    const ray_direction = LinAlg.sub(p_screen, Config.camera)

    for (const sphere of objects) {
      const color = get_pixel_color(Config.camera, ray_direction, sphere)
      
      if (!color) continue
      
      // Colorir o pixel
      img.setPixelColor(color, x, y)
    }
  }

  // Salvar imagem
  img.write(`${Config.img_file_name}.jpg`)
})()