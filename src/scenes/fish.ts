import { Application, Container, Sprite,Texture,TextStyle,Text,Shader, Graphics, Renderer, RenderTexture, autoDetectRenderer, SCALE_MODES } from 'pixi.js';

export class Fish extends Sprite {
    rv:number=Math.PI/240
    constructor(state:{x:number,y:number,rotation:number}) {
        super();
        this.width=20
        this.height=20
        this.rotation=state.rotation
        this.x=state.x
        this.y=state.y
   
        this.anchor.set(0.5)
        // let tr=new Graphics()
        // tr.beginFill(0xDE3249);
        // tr.drawRect(50, 50, 100, 100);
        // tr.endFill();
        // this.texture=autoDetectRenderer().generateTexture(tr,SCALE_MODES.LINEAR,1)
        this.texture=Texture.from("assets/arrow.svg")
    }
}
export class Fishes extends Container {
    app: Application;
    sprites:Array<Fish>=[]
    state: { velocity: { x: number; y: number } };
    t:DOMHighResTimeStamp=window.performance.now();
    fps:number=0
    constructor(app: Application) {
        super();
        this.app = app;
        this.state = { velocity: { x: 1, y: 1 } };
        this.update = this.update.bind(this);
        
        // this.sprite = new Sprite(
        //     app.loader.resources['assets/hello-world.png'].texture
        // );
        console.log(window.innerWidth,window.innerHeight)

        this.generateFish(200)

        // const p = document.createElement("p");
        // document.body.appendChild(p);

        // Handle window resizing 

        
        // window.addEventListener('resize', (e) => {
        //     this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
        //     this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
        // });

        app.ticker.add(this.update);
    }
    generateFish(total:number){
        let wx=window.innerWidth
        let wy=window.innerHeight
        let count:number=0
        let generateTimes:number=0
        const generate=(count:number)=>{if(count<total){
            let x:number=Math.round(Math.random()*wx)
            let y:number=Math.round(Math.random()*wy)
            let rotation:number=Math.round(Math.random()*Math.PI*2)
            let fish:Fish=new Fish({x:x,y:y,rotation:rotation})
            generateTimes+=1
            if(this.checkNotCrash(fish,this.sprites).notCrash){
            this.sprites.push(fish)
            this.addChild(fish);
            count+=1}
            generate(count)
        }
    }
    generate(count)
    console.log('generateTimes:',generateTimes)
    }
    checkNotCrash(sprite:Sprite,sprites:Array<Fish>,range?:number):{notCrash:boolean,crashList:Array<Fish>}{
        let notCrash:boolean=true
        let crashList:Array<Fish>=[]
        let _range:number=range||20
        for(let i=0;i<sprites.length;i++){
            if( sprite.x>sprites[i].x-_range
                &&sprite.x<sprites[i].x+_range
                &&sprite.y>sprites[i].y-_range
                &&sprite.y<sprites[i].y+_range){
                    notCrash=false
                    crashList.push(sprites[i])
                   }
        }
        return {notCrash,crashList}
    }
    siteCalculate(fish:Fish,sprites:Array<Fish>){
        let temp:Array<{x:number,y:number}>=[]
        sprites.forEach((e)=>{
            const transform=(site:{x:number,y:number},rotation:number)=>{
                let x=site.x*Math.cos(rotation)+site.y*Math.sin(rotation)
                let y=(site.y*Math.cos(rotation)-site.x*Math.sin(rotation))*-1
                return {x,y}
            }
            let _x=e.x-fish.x
            let _y=e.y-fish.y
            if(_x!=0&&_y!==0){
            temp.push(transform({x:_x,y:_y},fish.rotation))
        }
        })
        return temp

    }
    update(_: any, delta: number) {
        // if (
        //     this.sprite.x <= 0 ||
        //     this.sprite.x >= window.innerWidth - this.sprite.width
        // ) {
        //     this.state.velocity.x = -this.state.velocity.x;
        // }
        // if (
        //     this.sprite.y <= 0 ||
        //     this.sprite.y >= window.innerHeight - this.sprite.height
        // ) {
        //     this.state.velocity.y = -this.state.velocity.y;
        // }
        // this.sprite.x += this.state.velocity.x;
        // this.sprite.y += this.state.velocity.y;

        //每帧更新
        this.sprites.forEach(
            (e)=>{
                let diraction:number=0
                let crashList=this.checkNotCrash(e,this.sprites,80).crashList
                let crashListSites=this.siteCalculate(e,crashList)
                crashListSites.forEach((g)=>{
                    if (g.y>0){
                        if(g.x<0){diraction-=1}else{
                            diraction+=1
                        }
                    }
                })
                if(diraction>0){e.rotation+=e.rv}else{
                    e.rotation-=e.rv
                }
                e.x-=Math.sin(e.rotation)
                e.y+=Math.cos(e.rotation)
            }
        )

        //计算帧数
        let n:DOMHighResTimeStamp=window.performance.now()
        let diff:number=n-this.t
        this.t=n
        this.fps=1000/diff
        
        document.body.childNodes[0].textContent=this.fps.toFixed(2)
    }
}
