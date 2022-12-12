import { glMatrix } from 'gl-matrix';
import * as pixiJs from 'pixi.js';
import { Fish } from '../sprites/fish';
import { vec2 } from "gl-matrix";

type Sprite = pixiJs.Sprite;

export default class Boid2D extends pixiJs.Container {
    app: pixiJs.Application;
    sprites: Array<Fish> = [];
    state: { velocity: { x: number; y: number } };
    t: DOMHighResTimeStamp = window.performance.now();
    fps: number = 0;
    tick: number = 0;
    fpsRecord: Array<number> = [];
    constructor(app: pixiJs.Application) {
        super();
        this.app = app;
        this.state = { velocity: { x: 1, y: 1 } };
        this.update = this.update.bind(this);
        console.log(window.innerWidth, window.innerHeight);
        this.generateFish(200);

        // Handle window resizing
        // window.addEventListener('resize', (e) => {
        //     this.sprite.x = window.innerWidth / 2 - this.sprite.width / 2;
        //     this.sprite.y = window.innerHeight / 2 - this.sprite.height / 2;
        // });

        app.ticker.add(this.update);
    }
    generateFish(total: number) {
        let wx = window.innerWidth;
        let wy = window.innerHeight;
        let count: number = 0;
        let generateTimes: number = 0;
        const generate = (count: number) => {
            if (count < total) {
                let x: number = Math.round(Math.random() * wx);
                let y: number = Math.round(Math.random() * wy);
                let rotation: number = Math.round(Math.random() * Math.PI * 2);
                let fish: Fish = new Fish({ x: x, y: y, rotation: rotation });
                generateTimes += 1;
                if (this.crashCheck(fish, this.sprites).notCrash) {
                    this.sprites.push(fish);
                    this.addChild(fish);
                    count += 1;
                }
                generate(count);
            }
        };
        generate(count);
        console.log('generateTimes:', generateTimes);
    }
    crashCheck(
        sprite: Sprite,
        sprites: Array<Fish>,
        range?: number
    ): { notCrash: boolean; crashList: Array<Fish> } {
        let notCrash: boolean = true;
        let crashList: Array<Fish> = [];
        let _range: number = range || 20;
        for (let i = 0; i < sprites.length; i++) {
            if (
                sprite.x > sprites[i].x - _range &&
                sprite.x < sprites[i].x + _range &&
                sprite.y > sprites[i].y - _range &&
                sprite.y < sprites[i].y + _range
            ) {
                notCrash = false;
                crashList.push(sprites[i]);
            }
        }
        return { notCrash, crashList };
    }
    borderCheck(sprite: Sprite) {}
    siteCalculate(fish: Fish, sprites: Array<Fish>) {
        let temp: Array<{ x: number; y: number }> = [];
        sprites.forEach((e) => {
            const transform = (
                site: { x: number; y: number },
                rotation: number
            ) => {
                let x =
                    site.x * Math.cos(rotation) + site.y * Math.sin(rotation);
                let y =
                    (site.y * Math.cos(rotation) -
                        site.x * Math.sin(rotation)) *
                    -1;
                return { x, y };
            };
            let _x = e.x - fish.x;
            let _y = e.y - fish.y;
            if (_x != 0 && _y !== 0) {
                temp.push(transform({ x: _x, y: _y }, fish.rotation));
            }
        });
        return temp;
    }
    update(_: any, delta: number) {
        //每帧更新
        this.sprites.forEach((e) => {
            if (e.x < -e.width / 2) {
                e.x = window.innerWidth + e.width / 2;
            } else if (e.x > window.innerWidth + e.width / 2) {
                e.x = -e.width / 2;
            } else if (e.y < e.height / 2) {
                e.y = window.innerHeight + e.y / 2;
            } else if (e.y > window.innerHeight + e.y / 2) {
                e.y = -e.height / 2;
            }
            let diraction: number = 0;
            let crashList = this.crashCheck(e, this.sprites, 50).crashList;
            let crashListSites = this.siteCalculate(e, crashList);
            crashListSites.forEach((g) => {
                const distance = (x: number, y: number) => {
                    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                };

                if (g.y > 0) {
                    if (g.x < 0) {
                        diraction -= 1;
                    } else {
                        diraction += 1;
                    }
                }
            });
            if (diraction > 0) {
                e.rotation += e.rv;
            } else {
                e.rotation -= e.rv;
            }
            e.x -= Math.sin(e.rotation);
            e.y += Math.cos(e.rotation);
        });

        //计算帧数

        let n: DOMHighResTimeStamp = window.performance.now();
        let diff: number = n - this.t;
        this.t = n;
        this.fps = 1000 / diff;

        this.fpsRecord.push(this.fps);
        if ((this.fpsRecord.length = 60)) {
            this.fpsRecord.shift();
        }
        if (this.tick == 0 || this.tick % 60 == 0) {
            let average =
                this.fpsRecord.reduce((a: number, c: number) => a + c, 0) / 60;
            document.body.childNodes[0].textContent = average.toFixed(2);
        }
        this.tick += 1;
    }
}
