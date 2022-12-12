import PIXI, { Sprite } from "pixi.js"
import  glMatrix  from "gl-matrix"
export default class Physics{
    
}
interface Site{
    x:number|undefined,y:number|undefined
}

//定义Ray类用于表示射线
class Ray {
    origin: glMatrix.vec2;
    direction: glMatrix.vec2;

    
    constructor(origin: glMatrix.vec2, direction: glMatrix.vec2) {
      this.origin = origin;
      this.direction = direction;
    }
  
    //实现根据射线参数range实现射线上某点坐标
    pointAt(recv:glMatrix.vec2,range: number): glMatrix.vec2 {
        let scale={}as glMatrix.vec2
        glMatrix.vec2.scale(scale,this.direction, range)
        glMatrix.vec2.add(recv,this.origin, scale);
        return recv
    }
  }
export class RayCast{
    public start:Site={x:undefined,y:undefined}
    public end:Site={x:undefined,y:undefined}
    public angle:number
    constructor(sprite:PIXI.Sprite,angle:number){
        this.start.x=sprite.x
        this.start.y=sprite.y
        this.angle=angle
    }
    public create(){

        return this
    }
}