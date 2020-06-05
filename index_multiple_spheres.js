function Sphere(v, r) {
  return {
    center: v, r: r
  }
}

(async () => {
  const Jimp = require('jimp')

  const Config = require('./config')
  const LinAlg = require('./lin_alg')

  // Leva ponto x no intervalo [a, b] no intervalo [c, d]
  function linear(a, b, c, d, x) { return (d - c) * (x - a) / (b - a) + c }

  function solve_quadratic_equation(A, B, C) {
    const Delta = B * B - 4 * A * C

    if (Delta < 0) return false

    if (Delta == 0) {
      return { t: (-B) / (2 * A) }
    }

    return {
      t1: (-B + Math.sqrt(Delta)) / (2 * A),
      t2: (-B - Math.sqrt(Delta)) / (2 * A)
    }
  }

  // Calcula o ponto de intersecao na superficie da esfera
  // de um raio q sai da camera e passa por um ponto x, y, z
  // da tela na cena
  function ray_intersection_sphere(orig, dire, sphere) {
    const aux = LinAlg.sub(orig, sphere.center)

    // Resolver equacao (Dx^2 + Dy^2 + Dz^2)*t^2 + 2*(x0*Dx + y0*Dy = z0*Dz)*t + (x0^2 + y0^2 + z0^2 - 1) = 0
    // onde (x0, y0, z0) eh a camera. Tomar menor raiz, pois eh a que fica mais proxima da camera
    const A = LinAlg.dot_product(dire, dire)
    const B = 2 * LinAlg.dot_product(dire, aux)
    const C = LinAlg.modulo(aux) ** 2 - sphere.r ** 2

    const roots = solve_quadratic_equation(A, B, C)

    if (!roots) return false

    // Escolher a solucao mais proxima da camera
    let t
    if (roots.t) {
      t = roots.t
    } else {
      t = Math.min(roots.t1, roots.t2)
    }

    // orig + t * dire
    return LinAlg.add(orig, LinAlg.mul(t, dire))
  }

  // Calcula a cor de um ponto da superficie da esfera
  // visivel pela camera
  function phong(p, sphere) {
    // Por conveniencia a esfera esta centrada na origem e tem raio 1
    // Logo, o vetor normal a superfice no ponto p eh o proprio ponto p
    const N = LinAlg.normalize(LinAlg.sub(p, sphere.center))

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

  function get_pixel_color(camera, ray_direction, sphere) {
    // Calcular ponto de intersecao do raio que chega na camera com a esfera
    const p = ray_intersection_sphere(camera, ray_direction, sphere)

    // Se tiver ponto de intersecao com a esfera
    if (!p) return false
    
    // Reflexao de Phong
    const color = phong(p, sphere)

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
      const _ = 0.1
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
      linear(0, img.bitmap.width, -Config.screen.W / 2, Config.screen.W / 2, x),
      linear(0, img.bitmap.height, Config.screen.H / 2, -Config.screen.H / 2, y),
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