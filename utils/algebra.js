// Leva ponto x no intervalo [a, b] no intervalo [c, d]
function linear(a, b, c, d, x) { return (d - c) * (x - a) / (b - a) + c }

// Resolver equacao do segundo grau
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

module.exports = {
  linear: linear,
  solve_quadratic_equation: solve_quadratic_equation
}