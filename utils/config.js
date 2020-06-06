module.exports = {
  // Posicao da camera
  camera: {
    x: 0,
    y: 0,
    z: 3
  },

  // Posicao da tela e comprimentos
  screen: {
    W: 1.0,
    H: 1.0,
    z_position: 2
  },

  // Posicao da fonte de luz
  light_source: {
    x: 0,
    y: 0,
    z: 0.5
  },

  // Resolucao da imagem
  image_resolution: {
    W: 300,
    H: 300,
  },

  // Constante de reflexao especular da esfera
  Ks: 0.8,
  // Brilho/rugosidade do material
  shininess: 50,

  // Constante de reflexao por difusao da esfera para os 3 canais RGB
  Kd: {
    R: 0.363849765,
    G: 0.208920188,
    B: 0.427230047
  },

  // Intensidade da fonte luminosa
  I: {
    R: 255,
    G: 255,
    B: 255
  },

  // Intensidade luminosa do ambiente
  I_amb: {
    R: 40,
    G: 0,
    B: 40
  },

  // Componentes consideradas no modelo de Phong
  phong: {
    amb: true,
    dif: true,
    spe: true
  },

  // Nome do arquivo da imagem gerada
  img_file_name: 'img/multiple_spheres'
}
