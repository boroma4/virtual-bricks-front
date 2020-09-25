import React, {useEffect} from 'react';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import houseObj from '../hous.obj'
import {useLocation, useHistory} from 'react-router-dom';
import Button from "react-bootstrap/Button";


function HouseModelViewPage() {
    let animationId, renderer;
    let location = useLocation();
    const history = useHistory();
    const startLocation = location.pathname;
    useEffect(()=>{
        let w = window.innerWidth / 1.5, h = window.innerHeight / 1.5;
        // We need 3 things everytime we use Three.js
        // Scene + Camera + Renderer

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w/h, 1, 1000);
        camera.position.set(0, 0, 20);
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.gammaOutput = true;

        renderer.setSize(window.innerWidth, window.innerHeight);
// sets renderer background color
        renderer.setClearColor("pink");
        document.body.appendChild(renderer.domElement);
        camera.position.z = 5;

// resize canvas on resize window
        window.addEventListener('resize', () => {
            let width = window.innerWidth;
            let height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix()
        });

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 300, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 75, 300, -75 );
        scene.add( dirLight );

        const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
        camera.position.set( 0, 20, 100 );
        controls.update();

        let house;
        const loader = new OBJLoader();
        loader.load(
            // resource URL
            houseObj,
            // called when resource is loaded
            function ( object ) {
                house = object;
                scene.add( object );
            },
            // called when loading is in progresses
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened', error );
            }
        );
        renderer.domElement.addEventListener("dblclick", onDblClick);
        function onDblClick(event){
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight  ) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            let intersects = raycaster.intersectObject(house, true);
            if (intersects.length < 1) return;

            let o = intersects[0];
            let pIntersect = o.point.clone();
            house.worldToLocal(pIntersect);
            const geometry = new THREE.BoxGeometry( 5, 5, 5 );
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            const cube = new THREE.Mesh( geometry, material );
            cube.position.copy(o.face.normal).multiplyScalar(0.25).add(pIntersect);
            scene.add( cube );
        }

        function animate() {
            if(location.pathname !== startLocation || location.action === 'POP'){
                cancelAnimationFrame(animationId);
                document.body.removeChild(renderer.domElement);
            }
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera)
        }
        animate()
    }, []);

    const closeModelScreen = (e) =>{
        cancelAnimationFrame(animationId);
        document.body.removeChild(renderer.domElement);
        history.push('/');
    };

    return (
        <div>
            <Button variant="warning" onClick={closeModelScreen}>Close</Button>
        </div>
    );
}

export default HouseModelViewPage;
