//VizHandler
//Handle 3D world
var VizHandler = function () {

    var rendertime = 0; //constantly incrementing value public
    var camera, scene, renderer, controls, fullscreen = false;
    var cubeCameraRead, cubeCameraWrite;
    var debugCube;
    var renderToggle = true;
    var mobile

    var FIXED_SIZE_W = 384 * 2.5;
    var FIXED_SIZE_H = 256 * 2.5;

    var BG_COLOR = 0;
    var directionalLight;
    var time = 0;

    function init() {

        var id = parseInt(window.location.hash.substr(1))
        if (!id)
            id = 1
        ControlsHandler.fxParams.song = id;

        //EVENT HANDLERS
        events.on("update", update);

        // var container = document.getElementById('viz')
        //document.body.appendChild(container);


        //RENDERER
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(96 * 2, 64 * 2);
        renderer.domElement.setAttribute('id', 'three');
        renderer.domElement.style.zIndex = "10000";
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.display = "none";
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        //3D SCENE
        //camera = new THREE.PerspectiveCamera( 70, 800 / 600, 50, 30000 );
        camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .01, 1000);
        camera.position.z = .9;
        //camera.position.y = .2;
        //scene.add(camera);

        //controls = new THREE.TrackballControls(camera);
        controls = new THREE.OrbitControls(camera, document.getElementById('container'));
        controls.target.set(0, 0, 0);
        controls.update();
        controls.autoRotate = true;
        controls.enablePan = false
        controls.enableZoom = false
        controls.enableDamping = true;
        controls.dampingFactor = .3;
        controls.rotateSpeed = .25
        controls.autoRotateSpeed = Math.random() * .5 - .25
        controls.minDistance = .8
        controls.maxDistance = .8
        controls.maxPolarAngle = Math.PI / 2 + .4
        controls.minPolarAngle = Math.PI / 2 - .4

        Assets.init();

        activeViz = [Shards, BG, Asteroid];

        activeVizCount = activeViz.length;
        for (var j = 0; j < activeVizCount; j++) {
            activeViz[j].init();
        }

        //window.addEventListener('deviceorientation', setOrientationControls, true);

        initIndex()
    }

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls.enabled = false
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        window.removeEventListener('deviceorientation', setOrientationControls, true);

        if (renderer.domElement) {
            renderer.domElement.addEventListener('click', function () {

                if (this.requestFullscreen) {
                    this.requestFullscreen();
                } else if (this.msRequestFullscreen) {
                    this.msRequestFullscreen();
                } else if (this.mozRequestFullScreen) {
                    this.mozRequestFullScreen();
                } else if (this.webkitRequestFullscreen) {
                    this.webkitRequestFullscreen();
                }
                fullscreen = true;

            });

            mobile = true;

        }
    }

    function update() {
        time += .01;
        controls.target.set(Math.sin(time) / 25, Math.cos(time * .8) / 25, Math.sin(time * 1.1) / 25)
        controls.update();
        controls.autoRotateSpeed = Math.sin(time / 10) / 5

        if (mobile) {
            camera.position.set(0, 0, 0)
            camera.translateZ(.9);
        }
    }


    function onResize() {

        var renderW = FIXED_SIZE_W;
        var renderH = FIXED_SIZE_H;

        if (ControlsHandler.vizParams.fullSize) {
            //var renderW = window.innerWidth;
            //var renderH = window.innerHeight;

            if (ControlsHandler.vizParams.showControls) {
                renderW -= 250;
            }
            $('#viz').css({position: 'relative', top: 0});

        } else {
            //vertically center viz output
            $('#viz').css({position: 'relative', top: window.innerHeight / 2 - FIXED_SIZE_H / 2});
        }

        camera.aspect = renderW / renderH;
        camera.updateProjectionMatrix();
        renderer.setSize(renderW, renderH);

    }

    return {
        init: init,
        update: update,
        getCamera: function () {
            return camera;
        },
        getScene: function () {
            return scene;
        },
        getLight: function () {
            return directionalLight;
        },
        getRenderer: function () {
            return renderer;
        },
        getCubeCameras: function () {
            return [cubeCameraRead, cubeCameraWrite]
        },
        getControls: function () {
            return controls;
        },
        onResize: onResize,
        isFullscreen: function () {
            return fullscreen;
        },
        FIXED_SIZE_W: FIXED_SIZE_W,
        FIXED_SIZE_H: FIXED_SIZE_H

    };

}();