import * as THREE from 'three';
import { Mesh, MeshLambertMaterial, MeshPhongMaterial, Plane } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';


var model = new THREE.Group;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const fov = 60;
const aspect = innerWidth / innerHeight;
const near = 1.0;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(75,20,0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const light = new THREE.DirectionalLight(0xFFFFFF, 1.1);
light.position.set(20, 100, 50);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500.0;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
scene.add(light);

const ambient = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambient);

const controls = new OrbitControls(
    camera, renderer.domElement
);
//controls.target.set(0, 20, 0);
//controls.update();
controls.enableDamping = true;
controls.enablePan = false;
controls.enableRotate = false;
controls.enableZoom = false;

//Plane
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
    })
);
floor.castShadow = true;
floor.receiveShadow = false;
floor.rotation.x = Math.PI / 2;
floor.position.y = -40;
//scene.add(floor);

//the MODEL
LoadModelGLTF();

function LoadModelGLTF(){
    const loader = new GLTFLoader();

    loader.load('./resources/gltf/scene.gltf', (gltf) =>{
        gltf.scene.traverse(c => {
            if(c instanceof Mesh){
                var prevMat = c.material;
                c.material = new MeshPhongMaterial();
                MeshLambertMaterial.prototype.copy.call(c.material, prevMat);
                c.castShadow = true;
                c.receiveShadow = true;
            }

            c.castShadow = true;
            c.receiveShadow = true;
        });

        gltf.scene.scale.setScalar(5);

        var box = new THREE.Box3().setFromObject(gltf.scene);
        box.getCenter(gltf.scene.position);
        //gltf.scene.position.y = -0.5;
        gltf.scene.position.multiplyScalar(-1);

        //Pivot
        scene.add(model);
        model.add(gltf.scene);
    });
}

function render(){
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();

    model.rotation.y += 0.001;

    render();
}

animate();

addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});