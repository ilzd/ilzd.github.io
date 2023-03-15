import Phaser from './lib/phaser.js'
import GameScene from './scenes/game.js';
import MenuScene from './scenes/menu.js';
import PreloadScene from './scenes/preload.js';

export default new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser',
  backgroundColor: 0x66AAFF,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [PreloadScene, MenuScene, GameScene]
});

const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "controls_repeat_ext"
    },
    {
      "kind": "block",
      "type": "math_number"
    },
    {
      "kind": "block",
      "type": "character_walk"
    },
    {
      "kind": "block",
      "type": "character_rotate"
    }
  ]
}

Blockly.defineBlocksWithJsonArray([{
  "type": "character_rotate",
  "message0": 'Rotacionar para %1',
  "colour": 160,
  "args0": [
    {
      "type": "field_dropdown",
      "name": "direction",
      "options": [
        [ "direita", "right" ],
        [ "esquerda", "left" ]
      ]
    }
  ],
  "tooltip": "Rotaciona o seu personagem no sentido selecionado",
  "previousStatement": null,
  "nextStatement": null,
}]);

Blockly.defineBlocksWithJsonArray([{
  "type": "character_walk",
  "message0": 'Andar',
  "colour": 80,
  "tooltip": "Movimenta o personagem para a frente",
  "previousStatement": null,
  "nextStatement": null,
}]);

Blockly.JavaScript['character_rotate'] = function(block) {
  const dir = block.getFieldValue('direction')
  if(dir === 'right') return 'window.phaserRight()\n';
  
  return 'window.phaserLeft()\n';  
};

Blockly.JavaScript['character_walk'] = function() {
  return 'window.phaserWalk()\n'
};

var workspace = Blockly.inject('blockly', { toolbox: toolbox })

document.getElementById('run').addEventListener('pointerdown',() => {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  window.phaserClear()
  eval(code)
  window.phaserRun()
})