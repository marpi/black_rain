
    var passingRain=true;
var FXHandler = function () {

    var shaderTime = 0;
    var screenW = 1280;
    var screenH = 720;
    var blurriness = 3;
    var effects = false;
    var nuts = false;
    var bloomPass;
    var hblurPass = null;
    var vblurPass = null;
    var copyPass = null;
    var renderTarget2 = null;
    var glowComposer = null;
    var composer = null;
    var blendPass = null;
    var badTVPass = null;
    var mirrorPass = null;
    var dotScreenPass = null;
    var rgbPass = null;
    var smaaPass = null;
    var depthMaterial, depthRenderTarget;
    var msaaPass = null
    var effect;
    var scene, renderer, camera, controls, vrControls
    var controller1, controller2, material, geom, bubbles = []
    var materials = [], geoms = []
    var group = new THREE.Group()
    var rtTexture

    function init() {
        controls = VizHandler.getControls();
        scene = VizHandler.getScene();
        renderer = VizHandler.getRenderer();
        camera = VizHandler.getCamera();

        //EVENT HANDLERS
        events.on("update", update);
        events.on("onBeat", onBeat);

        setup()
    }

    function setup() {
        renderTarget = null;
        renderComposer = null;
        renderPass = null;
        copyPass = null;
        bloomPass = null;
        hblurPass = null;
        vblurPass = null;
        copyPass = null;
        renderTarget2 = null;
        glowComposer = null;
        composer = null;
        blendPass = null;
        badTVPass = null;
        mirrorPass = null;
        dotScreenPass = null;
        rgbPass = null;
        smaaPass = null;
        msaaPass = null;

        effects = null;
        nuts = null;

        effects = ControlsHandler.fxParams.effects;
        nuts = ControlsHandler.fxParams.nuts;
        // POST PROCESSING
        //common render target params
        var renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false};

        //BLEND COMP - COMBINE 1st 2 PASSES
        composer = new THREE.EffectComposer(renderer, new THREE.WebGLRenderTarget(VizHandler.FIXED_SIZE_W, VizHandler.FIXED_SIZE_H, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        }));
        renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        //rtTexture = new THREE.TextureLoader().load( "textures/black_sphere.jpg" );// 
        //rtTexture= new THREE.WebGLRenderTarget( VizHandler.FIXED_SIZE_W, VizHandler.FIXED_SIZE_H, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
        //rtTexture.texture
        
        // Setup depth pass
        /*var tiltShiftPass = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);
         tiltShiftPass.uniforms.focusPos.value = 0.5;
         tiltShiftPass.uniforms.amount.value = 0.01;
         tiltShiftPass.uniforms.brightness.value = 0.65 * 0.9;
         composer.addPass(tiltShiftPass)*/

        var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
        hblur.uniforms.h.value = 0.001;
        composer.addPass(hblur);

        var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
        vblur.uniforms.v.value = hblur.uniforms.h.value;
        composer.addPass(vblur);

        composer.passes[composer.passes.length - 1].renderToScreen = true;

        effect = new THREE.VREffect(renderer);

        vrControls = new THREE.VRControls(camera);
        vrControls.standing = true;

        if (WEBVR.isAvailable() === true) {
            document.body.appendChild(WEBVR.getButton(effect, switchControls));
        }

    }

    function switchControls() {
        passingRain=false
        
        $('canvas').hide()
        $('#three').show()
        $('#three').width(window.innerWidth)
        $('#three').height(window.innerHeight)

        controls.autoRotate = false;
        controls.enabled = false;

        scene.add(group)
        group.position.y = -1.5

        controller1 = new THREE.ViveController(0);
        controller1.standingMatrix = vrControls.getStandingMatrix();
        controller1.userData.points = [new THREE.Vector3(), new THREE.Vector3()];
        controller1.userData.matrices = [new THREE.Matrix4(), new THREE.Matrix4()];
        controller1.prevPosition = new THREE.Vector3();
        controller1.prevPositionStatic = new THREE.Vector3();
        group.add(controller1);

        controller2 = new THREE.ViveController(1);
        controller2.standingMatrix = vrControls.getStandingMatrix();
        controller2.userData.points = [new THREE.Vector3(), new THREE.Vector3()];
        controller2.userData.matrices = [new THREE.Matrix4(), new THREE.Matrix4()];
        controller2.prevPosition = new THREE.Vector3();
        controller2.prevPositionStatic = new THREE.Vector3();
        group.add(controller2);

        VizHandler.getRenderer().shadowMap.autoUpdate = true;

        var reflectionCube = Assets.getCubeMap(12)
        reflectionCube.format = THREE.RGBFormat;
        geom = new THREE.OctahedronGeometry(.01, 3)
        material = new THREE.MeshBasicMaterial({
            refractionRatio:.85,
            fog: false,
            envMap: reflectionCube,
            side: THREE.DoubleSide
        })

        var loader = new THREE.OBJLoader();
        loader.load('vr_controller_vive_1_5.obj', function (object) {

            var loader = new THREE.TextureLoader();

            var controller = object.children[ 0 ];
            controller.material = material

            controller1.add(controller);

            var controllerC = controller.clone()
            controller2.add(controllerC.clone());

        });

        onResize();
        effectUpdate()
        mobile = false;
    }

    function handleController(controller, id) {

        controller.update();

        if (controller.getButtonState('thumbpad')) {
        }

        if (controller.getButtonState('trigger')) {
            //if (controller.prevPosition.distanceTo(controller.position) > .02) {
            bubble = new THREE.Mesh(geom, material);
            bubble.scale.set(.001, .001, .001)
            var randomSize = controller.prevPositionStatic.distanceTo(controller.position) * 200
            if (randomSize < 2)
                randomSize = 2;
            if (randomSize > 6)
                randomSize = 6;
            //TweenMax.to(bubble.scale, .3, {x: randomSize, y: randomSize, z: randomSize})
            bubble.matrix = controller.matrix.clone()
            var pos = new THREE.Vector3();
            var q = new THREE.Quaternion();
            var s = new THREE.Vector3();
            bubble.matrix.decompose(pos, q, s)
            bubble.position.copy(pos)
            bubble.position.y -= 1.5
            scene.add(bubble);
            bubbles.push(bubble)

            var t = 2 + Math.random() * 2
            var dis = {
                x: controller.position.x - controller.prevPosition.x,
                y: controller.position.y - controller.prevPosition.y,
                z: controller.position.z - controller.prevPosition.z
            }

            TweenMax.to(bubble.scale, .6, {x: randomSize, y: randomSize, z: randomSize})
            var r = randomSize * 10
            TweenMax.to(bubble.position, t + .6, {ease: Linear.easeNone, x: bubble.position.x - r * dis.x, y: bubble.position.y + r * dis.y, z: bubble.position.z - r * dis.z})
            TweenMax.to(bubble.scale, .6, {delay: t, x: .001, y: .001, z: .001, onComplete: removeBubble, onCompleteParams: [bubble]})


            controller.prevPosition.copy(controller.position)
            //}


        } else {
        }

        controller.prevPositionStatic.copy(controller.position)


    }

    function removeBubble(bubble) {
        scene.remove(bubble)
    }

    function onBeat() {
        setTimeout(onBeatEnd, 300);
    }

    function onBeatEnd() {
    }

    function toggle() {
        setup()
    }

    function onResize() {
        return;
        var width = VizHandler.FIXED_SIZE_W;
        var height = VizHandler.FIXED_SIZE_H;

        var pixelRatio = renderer.getPixelRatio();
        var newWidth = Math.floor(width / pixelRatio) || 1;
        var newHeight = Math.floor(height / pixelRatio) || 1;
        if (composer)
            composer.setSize(newWidth, newHeight);

        if (vrControls) {
            effect.setSize(window.innerWidth, window.innerHeight);
        }

    }

     function effectUpdate() {
        if (vrControls)
            vrControls.update();

        if (controller1)
            handleController(controller1, 0);
        if (controller2)
            handleController(controller2, 1);

            camera.position.y -= 1.5
        effect.render(scene, camera);
            camera.position.y += 1.5
        /*renderer.setScissorTest( true );
         renderer.setViewport( 0, 0,renderer.getSize().width,renderer.getSize().height );
         renderer.setScissor( 0, 0, renderer.getSize().width,renderer.getSize().height );
         renderer.render(scene, camera);
         renderer.setScissorTest( false );*/

        effect.requestAnimationFrame(effectUpdate);
    }

    function update(t) {

        if (controller1)
            return;
        
        //renderer.render(scene, camera, rtTexture, true );
        renderer.render(scene, camera);
        return;

        //scene.overrideMaterial = depthMaterial;
        //renderer.render(scene, camera, depthRenderTarget, true);
        //scene.overrideMaterial = null;

        //if (composer) {
            //renderer.clear();
        //    composer.render();
        //}

    }

    return {
        init: init,
        update: update,
        toggle: toggle,
        onBeat: onBeat,
        onResize: onResize,
        getTexture:function(){return rtTexture}
    };

}();