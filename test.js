import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import { AmbientLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, TetrahedronBufferGeometry } from 'three';

class BasicWorldDemo {
  constructor(){
    this._Initalized();
  }

  _Initalized(){
    this._threejs = new THREE.WebGLRenderer({
      antialias: true
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(devicePixelRatio);
    this._threejs.setSize(innerWidth, innerHeight);

    document.body.appendChild(this._threejs.domElement);

    addEventListener('resize', ()=>{
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(50, 100, 50);
    light.target.position.set(0,0,0);
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
    this._scene.add(light);

    let ambient = new THREE.AmbientLight(0xFFFFFF, 0.4);
    this._scene.add(ambient);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement
    );
    controls.target.set(0, 20, 0);
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './resources/posx.jpg',
      './resources/negx.jpg',
      './resources/posy.jpg',
      './resources/negy.jpg',
      './resources/posz.jpg',
      './resources/negz.jpg',
    ]);
    //this._scene.background = texture;
    this._scene.background = new THREE.Color(0xFFFFFF);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = - Math.PI / 2;
    this._scene.add(plane);

    /*const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
      })
    )
    box.position.set(0, 1, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    this._scene.add(box);*/

    /*for(let x = -8; x < 8; x++){
      for(let y = -8; y < 8; y++){
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
          })
        );
        box.position.set(Math.random() + x * 5, Math.random() * 4.0 + 2.0, Math.random() + y *5);
        box.castShadow = true;
        box.receiveShadow = true;
        this._scene.add(box);
      }
    }*/

    this.LoadModelGLTF();
    
    this._RAF();
  }

  _OnWindowResize(){
    this._camera.aspect = innerWidth / innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(innerWidth, innerHeight);
  }

  _RAF(){
    requestAnimationFrame(() =>{
       this._threejs.render(this._scene, this._camera);
       this._RAF();
    });
  }

  LoadModelGLTF(){
    const loader = new GLTFLoader();
  
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );
  
    //./resources/Duck/gltf/duck.gltf

    loader.load('./resources/gltf/scene.gltf', (gltf) =>{
      gltf.scene.traverse(c => {   
        
        if(c instanceof Mesh) {
          var prevMat = c.material;
          c.material = new MeshPhongMaterial();
          MeshLambertMaterial.prototype.copy.call(c.material, prevMat);
          c.castShadow = true;
          c.receiveShadow = true;
        } 
     
        //console.log(c);          
        c.castShadow = true;
        c.receiveShadow = true;
        console.log(c);
      });
  
      //ltf.scene.scale.setScalar(1);
      gltf.scene.scale.setScalar(5);
  
      var box = new THREE.Box3().setFromObject( gltf.scene );
      box.center( gltf.scene.position ); // this re-sets the mesh position
      //gltf.scene.position.z = 20;
      gltf.scene.position.y = -0.5;
      //gltf.scene.rotation.set(.3, 0, 0);
      gltf.scene.position.multiplyScalar( - 1 );
    
      var pivot = new THREE.Group();    
      this._scene.add(pivot);
      pivot.add(gltf.scene);
  
      //light.target = pivot;
    });
    }
}

let App = null;

addEventListener('DOMContentLoaded', () =>{
  App = new BasicWorldDemo();
});
