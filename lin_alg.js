function vector(x, y, z) { return { x: x, y: y, z: z } }
const zeros = vector(0, 0, 0)

function add(u, v) { return vector(u.x + v.x, u.y + v.y, u.z + v.z) }
function sub(u, v) { return vector(u.x - v.x, u.y - v.y, u.z - v.z) }

function minus(v) { return sub(zeros, v) }

function mul(K, v) { return vector(K * v.x, K * v.y, K * v.z) }
function dot_product(u, v) { return u.x * v.x + u.y * v.y + u.z * v.z }

function modulo(v) { return Math.sqrt(dot_product(v, v)) }

function normalize(v) { return mul(1/modulo(v), v) }

function escalar_to_vec(K) { return vector(K, K, K) }
module.exports = {
  vector: vector,
  add: add,
  sub: sub,
  minus: minus,
  mul: mul,
  dot_product: dot_product,
  modulo: modulo,
  normalize: normalize,
  escalar_to_vec: escalar_to_vec
}