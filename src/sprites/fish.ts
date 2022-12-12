import * as pixiJs from 'pixi.js';
import config from '../config.json';
// import vertexShaderCode from '/assets/vertex-shader.glsl';
// const shader:pixiJs.Shader=pixiJs.Shader.from(vertexShaderCode)
export class Fish extends pixiJs.Sprite {
    rv: number = Math.PI / 240;
    
    constructor(state: { x: number; y: number; rotation: number; }) {
        super()
        this.width = config.fish.width;
        this.height = config.fish.height;
        this.rotation = state.rotation;
        this.x = state.x;
        this.y = state.y;
        this.anchor.set(0.5);
        this.alpha = 0.7;
        this.tint=0x0000ff
        this.texture = pixiJs.Texture.from("assets/arrow.svg");
    }

}
// const fish=new Fish({ x: 500, y: 500, rotation: 0 })
// let app = new PIXI.Application();
// document.body.appendChild(app.view);

// app.stage.addChild(fish);