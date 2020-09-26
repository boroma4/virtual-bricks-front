import React, {useEffect, useState} from 'react';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import houseObj from '../hous.obj'
import {useLocation, useHistory} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import SpriteText from 'three-spritetext';
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import AddCommentModal from "../cmp/AddCommentModal";
import {BackendService} from "../service/BackendService";

function HouseModelViewPage({modelId}) {
    const [modalShow, setModalShow] = useState(false);
    const[lastComment, setLastComment] = useState({});

    let animationId, renderer;
    let location = useLocation();
    const history = useHistory();
    const backendService = new BackendService();

    useEffect(()=>{
        let w = window.innerWidth / 1.5, h = window.innerHeight / 1.5;

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w/h, 1, 1000);
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

        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.position.set( 0, 500, 0 );
        scene.add( hemiLight );

        var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( -1, 0.75, 1 );
        dirLight.position.multiplyScalar( 50);
        dirLight.name = "dirlight";
        scene.add( dirLight );

        dirLight.castShadow = true;

        const controls = new OrbitControls( camera, renderer.domElement );

        camera.position.set( 0, 20, 100 );
        controls.update();

        let house;
        const loader = new OBJLoader();
        const loader2 = new ColladaLoader();

        // loader2.load(
        //     // resource URL
        //     'building-6585285.9-537017.4-6585285.9-537017.4.dae',
        //     // called when resource is loaded
        //     function ( object ) {
        //         scene.add( object.scene );
        //     }
        // );
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
            setLastComment({event});
            setModalShow(true);
        }

        function addComment(cmt){
                // send http request with data
                mouse.x = (cmt.event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(cmt.event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);

                let intersects = raycaster.intersectObject(house, true);
                if (intersects.length < 1) return;

                let o = intersects[0];
                let pIntersect = o.point.clone();

                let [commentText, commentTitle, commentHeader, commentAuthor] = cmt.body.split('\n');
                //const dto = {modelId, commentText: cmt.body, commentHeader: }

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
                myText.color = 'red';
                scene.add(myText);
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
