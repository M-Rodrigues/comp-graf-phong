module.exports = {
  camera: {
    x: 0,
    y: 0,
    z: 3
  },
  screen: {
    W: 1.0,
    H: 1.0,
    z_position: 2
  },
  light_source: {
    x: 0,
    y: 3,
    z: 3
  },
  image_resolution: {
    W: 300,
    H: 300,
  },
  Ks: 1,
  roughness_n: 10,
  Kd: {
    R: 0,
    G: 0,
    B: 0.6
  },
  I: {
    R: 255,
    G: 255,
    B: 255
  },
  I_amb: {
    R: 0,
    G: 0,
    B: 50
  },
  phong: {
    amb: true,
    dif: true,
    spe: true
  },
  img_file_name: 'img1'
}
