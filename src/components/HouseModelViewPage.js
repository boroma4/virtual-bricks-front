import React, {useEffect, useState} from 'react';
import * as THREE from "three";
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import houseObj from '../Cyprys_House.obj'
import houseMtl from '../Cyprys_House.mtl'
import obj2 from'../medieval house.dae'
import {useLocation, useHistory} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import SpriteText from 'three-spritetext';
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import AddCommentModal from "../cmp/AddCommentModal";
import {BackendService} from "../service/BackendService";
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

function HouseModelViewPage({modelId}) {
    const [modalShow, setModalShow] = useState(false);
    const[lastComment, setLastComment] = useState({});

    let animationId, renderer;
    let location = useLocation();
    const history = useHistory();
    const backendService = new BackendService();

    if(!modelId) modelId = 69

    useEffect(()=>{
        let w = window.innerWidth / 1.5, h = window.innerHeight / 1.5;

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w/h, 1, 3000);
        camera.position.set(0, 0, 20);
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.gammaOutput = true;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xadd8e6);
        document.body.appendChild(renderer.domElement);
        camera.position.z = 5;

        window.addEventListener('resize', () => {
            let width = window.innerWidth;
            let height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix()
        });

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( -1, 0.75, 1 );
        dirLight.position.multiplyScalar( 50);
        dirLight.name = "dirlight";
        scene.add( dirLight );

        dirLight.castShadow = true;

        const controls = new OrbitControls( camera, renderer.domElement );

        camera.position.set( 0, 20, 100 );
        controls.update();

        let house;
        const loader = new OBJLoader2();
        // const loader2 = new ColladaLoader();
        // loader2.options.convertUpAxis = true;
        //
        // loader2.load(
        //     // resource URL
        //     obj2,
        //     // called when resource is loaded
        //     function ( object ) {
        //         const house = object.scene;
        //         const bextMax = 400;
        //         const boundingBox = new THREE.Box3().setFromObject(house);
        //         const size = boundingBox.getSize();// Returns Vector3
        //         const max = Math.max(size.x, size.y, size.z);
        //         const scale = bextMax / max;
        //         house.scale.set(10, 10, 10);
        //         camera.lookAt(house.position)
        //         scene.add( house);
        //     }
        // );

        const mtlLoader = new MTLLoader();
        mtlLoader.load(houseMtl, (mtlParseResult) => {
            const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            loader.addMaterials(materials);
            loader.load(
                // resource URL
                houseObj,
                // called when resource is loaded
                function ( object ) {
                    house = object;
                    const helper = new THREE.BoundingBoxHelper(object, 0xff0000);
                    helper.update();
                    scene.add(helper);
                    const bextMax = 400;
                    const boundingBox = new THREE.Box3().setFromObject(house);
                    const size = boundingBox.getSize();// Returns Vector3
                    const max = Math.max(size.x, size.y, size.z);
                    const scale = bextMax / max;
                    object.scale.set(scale, scale, scale);
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
        });

        renderer.domElement.addEventListener("dblclick", onDblClick);

        function onDblClick(event){
            setLastComment({event});
            setModalShow(true);
        }

        async function addComment(cmt){
                // send http request with data
                mouse.x = (cmt.event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(cmt.event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);

                let intersects = raycaster.intersectObject(house, true);
                if (intersects.length < 1) return;

                let o = intersects[0];
                let pIntersect = o.point.clone();

                let [commentHeader, commentText , commentAuthor, locationName ] = cmt.body.split('\n');
                const dto = {modelId, commentText, commentHeader, commentAuthor, locationName, commentCoordinates: `${o.x} ${o.y} ${o.z}` };

                if(await backendService.addCommentToModel(dto)) {
                    const commentPoint = new THREE.Vector3()
                        .subVectors(pIntersect, raycaster.ray.origin)
                        .multiplyScalar(0.85)
                        .add(raycaster.ray.origin);

                    const hackedPoint = new THREE.Vector3()
                        .subVectors(pIntersect, raycaster.ray.origin)
                        .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.5)
                        .normalize()
                        .add(commentPoint);

                    let dir = [hackedPoint, pIntersect];

                    const directionGeom = new THREE.BufferGeometry().setFromPoints(dir);
                    const directionMat = new THREE.LineBasicMaterial({color: 0x00000});
                    const direction = new THREE.Line(directionGeom, directionMat);
                    scene.add(direction);


                    const myText = new SpriteText(cmt.body);
                    myText.position.copy(hackedPoint);
                    myText.color = 'green';
                    scene.add(myText);
                }
        }

        function animate() {
            animationId = requestAnimationFrame(animate);
            controls.update();
            setLastComment(prev=>{
                if(prev.body){
                    addComment(prev);
                    setLastComment({})
                }
                return prev;
            });

            renderer.render(scene, camera)
        }
        animate()
    },[]);

    const closeModelScreen = (e) =>{
        cancelAnimationFrame(animationId);
        document.body.removeChild(renderer.domElement);
        history.push('/');
    };


    return (
        <div>
            <Button variant="warning" onClick={closeModelScreen}>Close</Button>
            <AddCommentModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setComment={setLastComment}
            />
        </div>
    );
}

export default HouseModelViewPage;
