(async () => {
  const Jimp = require('jimp')

  const Config = require('./config')
  const LightModel = require('./utils/light')
  const LinAlg = require('./utils/lin_alg')
  const Algebra = require('./utils/algebra')

  const Sphere = require('./sphere')

  function get_pixel_color(camera, ray_direction, sphere) {
    // Calcular ponto de intersecao do raio que chega na camera com a esfera
    const p = LightModel.ray_intersection_sphere(camera, ray_direction, sphere)

    // Se tiver ponto de intersecao com a esfera
    if (!p) return [false, false]
    
    // Reflexao de Phong
    const color = LightModel.phong(p, sphere, Config)

    // Colocar a cor no intervalo [0, 255]
    function convert_color(c) {
      return Math.max(0, Math.min(255, Math.round(c)))
    }

    // Colorir o pixel
    return [p, Jimp.rgbaToInt(
      convert_color(color.R),
      convert_color(color.G),
      convert_color(color.B),
      255
    )]
  }

  async function sleep(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

  // Carregando esferas da cena
  const objects = Config.spheres.map(sphere => {
    const [x, y, z] = sphere.center
    return new Sphere(LinAlg.vector(x, y, z), sphere.radius)
  })

  
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
    
    let screen_dist
    for (const sphere of objects) {
      const [p, color] = get_pixel_color(Config.camera, ray_direction, sphere)
      
      if (!color || !p) continue
      
      const pixel_dist = LinAlg.modulo(LinAlg.sub(p, p_screen))
      if (p && !screen_dist) screen_dist = pixel_dist
      
      // Colorir o pixel
      if (pixel_dist <= screen_dist) {
        screen_dist = pixel_dist
        img.setPixelColor(color, x, y)
      }
    }
  }

  // Salvar imagem
  img.write(`${Config.img_file_name}.jpg`)
})()