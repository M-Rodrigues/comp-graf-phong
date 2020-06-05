(async () => {
  const Jimp = require('jimp')
  
  const Config = require('./config')
  const LinAlg = require('./lin_alg')

  // Leva ponto x no intervalo [a, b] no intervalo [c, d]
  function linear(a, b, c, d, x) { return (d - c) * (x - a) / (b - a) + c }

  // Calcula o ponto de intersecao na superficie da esfera
  // de um raio q sai da camera e passa por um ponto x, y, z
  // da tela na cena
  function ray_sphere_intersection(x, y, z) {
    // Direcao do raio de luz que chega na camera
    const D = {
      x: x - Config.camera.x,
      y: y - Config.camera.y,
      z: z - Config.camera.z
    }

    // Resolver equacao (Dx^2 + Dy^2 + Dz^2)*t^2 + 2*(x0*Dx + y0*Dy = z0*Dz)*t + (x0^2 + y0^2 + z0^2 - 1) = 0
    // onde (x0, y0, z0) eh a camera. Tomar menor raiz, pois eh a que fica mais proxima da camera
    const A = D.x * D.x + D.y * D.y + D.z * D.z
    const B = 2 * (Config.camera.x * D.x + Config.camera.y * D.y + Config.camera.z * D.z)
    const C = Config.camera.x * Config.camera.x + Config.camera.y * Config.camera.y + Config.camera.z * Config.camera.z - 1

    const Delta = B * B - 4 * A * C

    if (Delta < 0) return false

    let t
    if (Delta == 0) {
      t = (-B) / (2 * A)
    } else {
      t = Math.min(
        (-B + Math.sqrt(Delta)) / (2 * A),
        (-B - Math.sqrt(Delta)) / (2 * A)
      )
    }

    return {
      x: Config.camera.x + t * D.x,
      y: Config.camera.y + t * D.y,
      z: Config.camera.z + t * D.z
    }
  }

  // Calcula a cor de um ponto da superficie da esfera
  // visivel pela camera
  function phong(p) {
    // Por conveniencia a esfera esta centrada na origem e tem raio 1
    // Logo, o vetor normal a superfice no ponto p eh o proprio ponto p
    const N = p

    // Feixe de luz
    const L = LinAlg.normalize(LinAlg.vector(
      Config.light_source.x - p.x,
      Config.light_source.y - p.y,
      Config.light_source.z - p.z
    ))

    // Direcao de visada
    const V = LinAlg.normalize(LinAlg.vector(
      Config.camera.x - p.x,
      Config.camera.y - p.y,
      Config.camera.z - p.z
    ))

    // Direcao de reflexao
    const R = LinAlg.normalize(LinAlg.sub(LinAlg.mul(2, N), L))

    const dot_N_L = LinAlg.dot_product(N, L)
    const dot_R_V = LinAlg.dot_product(R, V)

    let color = LinAlg.vector(0, 0, 0)
    
    // Reflexao difusa
    if (Config.phong.dif) {
      color = LinAlg.add(color, LinAlg.vector(
        Config.Kd.R * dot_N_L * Config.I.R,
        Config.Kd.G * dot_N_L * Config.I.G,
        Config.Kd.B * dot_N_L * Config.I.B,
        ))
      }

    // Reflexao specular
    if (Config.phong.spe) {
      const val = dot_R_V ** Config.shininess
      color = LinAlg.add(color, LinAlg.vector(
        Config.Ks * val * Config.I.R,
        Config.Ks * val * Config.I.G,
        Config.Ks * val * Config.I.B
      ))
    }
    
    // Reflexao do ambiente
    if (Config.phong.amb) {
      color = LinAlg.add(color, LinAlg.vector(
        Config.I_amb.R,
        Config.I_amb.G,
        Config.I_amb.B,
      ))
    }

    return {
      R: color.x,
      G: color.y,
      B: color.z
    }
  }

  // Criando imagem
  const img = new Jimp(Config.image_resolution.W, Config.image_resolution.H, (err) => {
    if (err) throw err
  });

  // Varrendo cada pixel da imagem final
  for (const { x, y } of img.scanIterator(0, 0, img.bitmap.width, img.bitmap.height)) {
    // Converter ponto da imagem para ponto na tela da cena
    const [x_screen, y_screen, z_screen] = [
      linear(0, img.bitmap.width, -Config.screen.W / 2, Config.screen.W / 2, x),
      linear(0, img.bitmap.height, Config.screen.H / 2, -Config.screen.H / 2, y),
      Config.screen.z_position
    ]

    // Calcular ponto de intersecao do raio que chega na camera com a esfera
    const p = ray_sphere_intersection(x_screen, y_screen, z_screen)

    // Se tiver ponto de intersecao com a esfera
    if (p) {
      // Reflexao de Phong
      const color = phong(p)

      // Colocar a cor no intervalo [0, 255]
      function convert_color(c) {
        return Math.max(0, Math.min(255, Math.round(c)))
      }

      // Colorir o pixel
      img.setPixelColor(
        Jimp.rgbaToInt(
          convert_color(color.R),
          convert_color(color.G),
          convert_color(color.B),
          255
        ), x, y)
    }
  }

  // Salvar imagem
  img.write(`${Config.img_file_name}.jpg`)
})()