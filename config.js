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
    y: 3,
    z: 3
  },

  // Resolucao da imagem
  image_resolution: {
    W: 300,
    H: 300,
  },

  // Constante de reflexao especular da esfera
  Ks: 0.5,
  // Brilho/rugosidade do material
  shininess: 5,

  // Constante de reflexao por difusao da esfera para os 3 canais RGB
  Kd: {
    R: 0.122931442,
    G: 0.359338061,
    B: 0.517730496
  },

  // Intensidade da fonte luminosa
  I: {
    R: 255,
    G: 255,
    B: 255
  },

  // Intensidade luminosa do ambiente
  I_amb: {
    R: 0,
    G: 0,
    B: 50
  },

  // Componentes consideradas no modelo de Phong
  phong: {
    amb: true,
    dif: true,
    spe: true
  },

  // Nome do arquivo da imagem gerada
  img_file_name: 'img/pos2'
}
