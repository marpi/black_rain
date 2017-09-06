var BG = function () {

    var groupHolder;
    var material;
    var planeMaterial
    var spd = 0;

    var shapes = [];

    var cubeMesh;

    function init() {

        //console.log("BG")

        //init event listeners
        events.on("update", update);
        events.on("onBeat", onBeat);

        /*var cubeMapId = 12;
         
         cubeMap = Assets.getCubeMap(cubeMapId)
         
         var cubeShader = THREE.ShaderLib['cube'];
         cubeShader.uniforms['tCube'].value = cubeMap;
         
         var skyBoxMaterial = new THREE.ShaderMaterial({
         fragmentShader: cubeShader.fragmentShader,
         vertexShader: cubeShader.vertexShader,
         uniforms: cubeShader.uniforms,
         depthWrite: true,
         side: THREE.DoubleSide
         });
         
         var skyBox = new THREE.Mesh(
         new THREE.CubeGeometry(1000, 1000, 1000),
         skyBoxMaterial
         //new THREE.MeshBasicMaterial({color:0xFFFFFF,side: THREE.BackSide})
         );
         skyBox.scale.x=-1   
         groupHolder.add(skyBox);*/

        cubeMaterial = new THREE.MeshBasicMaterial({
            envMap: Assets.getCubeMap(),
            //opacity:.3,//.75,
            //transparent:true,
            //map: new THREE.TextureLoader().load("textures/black_sphere_org.jpg"),
            //color:0xFFFFFF,
            fog: false,
            //shading: THREE.FlatShading,
            //blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide//BackSide
        });

        cubeMesh = new THREE.Mesh(new THREE.OctahedronGeometry(600, 3), cubeMaterial);
        cubeMesh.scale.x = -1;
        cubeMesh.scale.z = -1;
        //cubeMesh.rotation.x = -.1;
        //cubeMesh.rotation.z = +.05;
        VizHandler.getScene().add(cubeMesh);


    }

    function update() {
        //cubeMesh.rotation.x+=.01

        //cubeMesh.rotation.x += spd * .001
        //cubeMesh.scale.x = cubeMesh.scale.y = cubeMesh.scale.z = 16 - ControlsHandler.fxParams.bgProgress * 8
        //groupHolder.rotation.z+=.001
    }

    function onBeat() {
        /*if (Math.random() < .05)
         spd = (Math.random() - .5)
         
         if (ControlsHandler.fxParams.wireframe) {
         cubeMesh.material.wireframe = true;
         planeMaterial.wireframe = true;
         } else {
         cubeMesh.material.wireframe = false;
         planeMaterial.wireframe = false;
         }
         
         
         var basic = [ControlsHandler.fxParams.colorProgress * .75, ControlsHandler.fxParams.colorProgress * .75, (1 - ControlsHandler.fxParams.colorProgress) * .5]
         cubeMesh.material.color.setRGB(basic[0] + Math.random() / 2, basic[1] + Math.random() / 2, basic[2] + Math.random() / 2);
         planeMaterial.color.setRGB(basic[0] + Math.random() / 2, basic[1] + Math.random() / 2, basic[2] + Math.random() / 2);
         if (ControlsHandler.fxParams.black) {
         cubeMesh.material.color.setRGB(.2, .2, .2);
         planeMaterial.color.setRGB(.2, .2, .2);
         }*/
    }

    return {
        init: init,
        update: update,
        onBeat: onBeat,
    };

}();