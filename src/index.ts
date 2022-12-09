import * as PIXI from 'pixi.js';
import { HelloWorld } from './scenes/helloWorld';
import { Fishes } from './scenes/fish';
const load = (app: PIXI.Application) => {
    return new Promise<void>((resolve) => {
        app.loader.add('assets/hello-world.png')
        .add('assets/arrow.svg')
        .load(() => {
            resolve();
        });
    });
};

const main = async () => {
    // Main app
    let app = new PIXI.Application();

    // Display application properly
    document.body.style.margin = '0';
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';
    app.renderer.backgroundColor=0xdddddd
    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    // Load assets
    await load(app);
    document.body.appendChild(app.view);

    // Set scene
    var scene = new Fishes(app);
    app.stage.addChild(scene);
};

main();
