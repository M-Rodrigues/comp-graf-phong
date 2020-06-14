const LinAlg = require('./lin_alg')
const Algebra = require('./algebra')

// Calcula o ponto de intersecao na superficie da esfera
// de um raio q sai da camera e passa por um ponto x, y, z
// da tela na cena
function ray_intersection_sphere(orig, dire, sphere) {
  const aux = LinAlg.sub(orig, sphere.center)

  // Resolver equacao (Dx^2 + Dy^2 + Dz^2)*t^2 + 2*(x0*Dx + y0*Dy = z0*Dz)*t + (x0^2 + y0^2 + z0^2 - r^2) = 0
  // onde (x0, y0, z0) eh a camera. Tomar menor raiz, pois eh a que fica mais proxima da camera
  const A = LinAlg.dot_product(dire, dire)
  const B = 2 * LinAlg.dot_product(dire, aux)
  const C = LinAlg.modulo(aux) ** 2 - sphere.radius ** 2

  const roots = Algebra.solve_quadratic_equation(A, B, C)

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
  function phong(p, sphere, config) {
    // Por conveniencia a esfera esta centrada na origem e tem raio 1
    // Logo, o vetor normal a superfice no ponto p eh o proprio ponto p
    const N = LinAlg.normalize(LinAlg.sub(p, sphere.center))

    // Feixe de luz
    const L = LinAlg.normalize(LinAlg.vector(
      config.light_source.x - p.x,
      config.light_source.y - p.y,
      config.light_source.z - p.z
    ))

    // Direcao de visada
    const V = LinAlg.normalize(LinAlg.vector(
      config.camera.x - p.x,
      config.camera.y - p.y,
      config.camera.z - p.z
    ))

    // Direcao de reflexao
    const R = LinAlg.normalize(LinAlg.sub(LinAlg.mul(2, N), L))

    const dot_N_L = LinAlg.dot_product(N, L)
    const dot_R_V = LinAlg.dot_product(R, V)

    let color = LinAlg.vector(0, 0, 0)

    // Reflexao difusa
    if (config.phong.dif) {
      color = LinAlg.add(color, LinAlg.vector(
        config.Kd.R * dot_N_L * config.I.R,
        config.Kd.G * dot_N_L * config.I.G,
        config.Kd.B * dot_N_L * config.I.B,
      ))
    }

    // Reflexao specular
    if (config.phong.spe) {
      const val = dot_R_V ** config.shininess
      color = LinAlg.add(color, LinAlg.vector(
        config.Ks * val * config.I.R,
        config.Ks * val * config.I.G,
        config.Ks * val * config.I.B
      ))
    }

    // Reflexao do ambiente
    if (config.phong.amb) {
      color = LinAlg.add(color, LinAlg.vector(
        config.I_amb.R,
        config.I_amb.G,
        config.I_amb.B,
      ))
    }

    return {
      R: color.x,
      G: color.y,
      B: color.z
    }
  }

module.exports = {
  ray_intersection_sphere,
  phong
}