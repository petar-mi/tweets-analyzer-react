import React, { Component } from 'react';
import * as THREE from 'three';
//import TrackballControls from 'three-trackballcontrols'; // DEINSTALIRATI jer ne odradjuje: npm uninstall three-trackballcontrols
//import TrackballControls from './TrackballControls';
//import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import helveticaBold from './helvetiker_bold.typeface.json';
import SingleTweet from './SingleTweet';

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();




class ThreeScene extends Component {
    state = {
        showPopup: false,
    };

    // onDocumentMouseDown = (event) => {
    //     event.preventDefault();
    //     console.log(event);
    // }



    componentDidMount() {
        console.log(this.props);

        //setTimeout( () => { console.log(this.props) }, 10000);


        this.onMouseMove = event => {
            event.preventDefault();

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            // mouse.x = (event.clientX - this.mount.offsetLeft / this.mount.innerWidth) * 2 - 1;

            // //console.log(window.innerWidth)

            // mouse.y = - (event.clientY - this.mount.offsetTop / this.mount.innerHeight) * 2 + 1;

            mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
            mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;

            //console.log(mouse.y)

        }

        this.onMouseClick = event => {
            event.preventDefault();

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            // mouse.x = (event.clientX - this.mount.offsetLeft / this.mount.innerWidth) * 2 - 1;

            // //console.log(window.innerWidth)

            // mouse.y = - (event.clientY - this.mount.offsetTop / this.mount.innerHeight) * 2 + 1;

            // mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
            // mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;

            this.clicked = !this.clicked;

            //console.log(mouse.y)

        }

        // this.onMouseUp = event => {
        //     event.preventDefault();

        //     // calculate mouse position in normalized device coordinates
        //     // (-1 to +1) for both components

        //     // mouse.x = (event.clientX - this.mount.offsetLeft / this.mount.innerWidth) * 2 - 1;

        //     // //console.log(window.innerWidth)

        //     // mouse.y = - (event.clientY - this.mount.offsetTop / this.mount.innerHeight) * 2 + 1;

        //     // mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
        //     // mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;
        //     this.clicked = !this.clicked;
        //     //console.log(mouse.y)

        // }

        // this.onDocumentMouseWheel = event => { // zumiranje scene pomocu mousewheel, zakomentarisano jer je ta funkcionalnost integrisana u OrbitControls

        //     var fovMAX = 160;
        //     var fovMIN = 1;

        //     this.camera.fov -= event.wheelDeltaY * 0.05;
        //     this.camera.fov = Math.max(Math.min(this.camera.fov, fovMAX), fovMIN);
        //     //this.camera.projectionMatrix = new THREE.Matrix4().makePerspective(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
        //     this.camera.updateProjectionMatrix();
        // }

        // setInterval(
        //     function () {
        //         console.log(this.state.sizeTarget);
        //         if (this.state.sizeTarget === 2.5) {
        //             this.setState({ sizeTarget: 1, size: 2.5 });
        //         } else {
        //             this.setState({ sizeTarget: 2.5, size: 1 });
        //         };
        //         console.log(this.state.sizeTarget);
        //     }
        //         .bind(this),
        //     1500
        // );



        //const width = this.mount.clientWidth;
        //const height = this.mount.clientHeight;
        //console.log(this.mount.clientHeight);
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        // this.camera = new THREE.PerspectiveCamera(
        //     75,
        //     //width / height,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     1000
        // )
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


        //this.camera.position.x = -3;
        //this.camera.position.y = 8;
        this.camera.position.z = 8; // staviti z=30 ako se radi sfera
        //this.camera = new THREE.OrthographicCamera( window.innerWidth / - 50, window.innerWidth / 50, window.innerHeight / 50, window.innerHeight / -50, - 500, 1000); 
        //this.camera.position.y = 3;
        console.log("this.camera.position.x, this.camera.position.y, this.camera.position.z", this.camera.position.x, this.camera.position.y, this.camera.position.z);
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#294658')
        //this.renderer.setSize(width, height);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);

        //ADD TEXT
        var loader = new THREE.FontLoader();
        var font = loader.parse(helveticaBold);




        // var politicsGeometry = new THREE.TextGeometry('Politics', {
        //     font: font,
        //     size: this.state.size,
        //     height: 0.1,
        //     curveSegments: 20,
        //     // bevelEnabled: true,
        //     // bevelThickness: 10,
        //     // bevelSize: 8,
        //     // bevelSegments: 5
        // });
        // var sportGeometry = new THREE.TextGeometry('Sport', {
        //     font: font,
        //     //size: this.state.size,
        //     //size: this.props.count[14].ratio,
        //     size: 0.5,
        //     height: 0.1,
        //     curveSegments: 20,
        //     // bevelEnabled: true,
        //     // bevelThickness: 10,
        //     // bevelSize: 8,
        //     // bevelSegments: 5
        // });
        //console.log("this.props.count[14].ratio", this.props.count[14].ratio);


        // var politicsMaterial = new THREE.MeshBasicMaterial({ color: "#89F0EC" });
        // this.politicsMesh = new THREE.Mesh(politicsGeometry, politicsMaterial);
        // this.politicsMesh.position.set(-2, 0, 0);
        // this.scene.add(this.politicsMesh);
        // console.log(this);


        // *** PRVI DEO POTREBAN ZA SFERU ****
        // var parent = new THREE.Object3D();
        // this.scene.add(parent);
        // *** KRAJ PRVOG DELA POTREBNOG ZA SFERU ****

        this.props.count.forEach(item => {
            console.log(item);
            this[item.cat + "Geometry"] = new THREE.TextGeometry(`${item.cat}`, {
                font: font,
                //size: this.state.size,
                //size: this.props.count[14].ratio,
                size: 0.5,
                height: 0.15,
                curveSegments: 20,
                // bevelEnabled: true,
                // bevelThickness: 10,
                // bevelSize: 8,
                // bevelSegments: 5
            });
            //this[item.cat + "Material"] = new THREE.MeshBasicMaterial({ color: "#0BA5AB", transparent: true, flatShading: true });
            this[item.cat + "Material"] = new THREE.MeshPhongMaterial({ color: "#0BA5AB", transparent: true, flatShading: true });
            this[item.cat + "Material"].opacity = 0;
            this[item.cat + "Mesh"] = new THREE.Mesh(this[item.cat + "Geometry"], this[item.cat + "Material"]);
            this[item.cat + "Mesh"].position.set(item.xPosition, item.yPosition, 0);
            this[item.cat + "Mesh"].callback = this.objectClickHandler;
            //this[item.cat + "Geometry"].addEventListener( 'click', (event) => this.gogo( item.cat, event ));


            // *** DRUGI DEO POTREBAN ZA SFERU ****
            // var stick = new THREE.Object3D();
            // var point = new THREE.Vector3(item.sphereX, item.sphereY, 2);
            // stick.lookAt(point);
            // parent.add(stick);
            // stick.add(this[item.cat + "Mesh"]);
            // *** KRAJ DRUGOG DELA POTREBNOG ZA SFERU ****


            this.scene.add(this[item.cat + "Mesh"]); // zakomentarisati ako se radi sfera
        });



        // var stick = new THREE.Object3D();
        // var point = new THREE.Vector3(2, 2, 2);
        // stick.lookAt(point);
        // this.parent.add(stick);


        // mesh.position.set(0, 0, r);
        // stick.add(mesh);
        //ADD CUBE
        // const geometry = new THREE.BoxGeometry(1, 1, 1)
        // const material = new THREE.MeshBasicMaterial({ color: '#0BA5AB' })
        // this.cube = new THREE.Mesh(geometry, material)
        // this.cube.position.set(2, 1, -3);
        // this.scene.add(this.cube)
        let pointLight = new THREE.PointLight(0xdddddd);
        //pointLight.position.set(-5, -3, 3);
        pointLight.position.set(0, 0, 10); // staviti 30 ako se radi sfera
        this.scene.add(pointLight);

        let ambientLight = new THREE.AmbientLight(0x505050);
        this.scene.add(ambientLight);

        window.addEventListener('resize', this.onWindowResize, false);
        //document.addEventListener( 'mousewheel', event => this.onDocumentMouseWheel(event), false ); // zumiranje scene pomocu mousewheel, zakomentarisano jer je ta funkcionalnost integrisana u OrbitControls

        this.mount.addEventListener('mousemove', event => this.onMouseMove(event), false); // omogucava funkcionalnost raycaster-a

        this.mount.addEventListener('click', event => this.onMouseClick(event), false);

        // let controls = new TrackballControls( this.camera, this.renderer.domElement );
        // controls.rotateSpeed = 1.0;
        // controls.zoomSpeed = 1.2;
        // controls.panSpeed = 0.8;
        // controls.staticMoving = true;
        // controls.dynamicDampingFactor = 0.3;
        // controls.keys = [ 65, 83, 68 ];
        // controls.addEventListener( 'change', console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") );

        new OrbitControls(this.camera, this.renderer.domElement); // kontrolise rotacije i zoom pomocu misa, (ne mora da se dodeli nekoj promenjivoj da bi radilo)

        this.onHoverObject = {};
        this.clicked = false;

        this.start()
    }
    objectClickHandler = (event) => {
        this.clicked = !this.clicked;
        // alert (this.onHoverObject.name);
        this.setState({ showPopup: true });
    }
    categorySelectedHandler = (e) => {
        console.log("ispisivanje iz Category.js: " + e.tweet.text + " " + e.tweet.id + " " + e.tweet.categoryInput);
        console.log("rucno unesena kategorija: " + e.newCat);
        this.props.categoryEdited(e);
     }
    onWindowResize = () => {
        console.log(window.innerWidth, window.innerHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {

        //this.cube.rotation.x += 0.01
        //this.cube.rotation.y += 0.01
        // this.politicsMesh.rotation.x += 0.01
        // this.politicsMesh.rotation.y += 0.01

        // if (this.state.size < this.state.sizeTarget) {
        //  this.politicsMesh.scale.x += 0.01;
        //  this.politicsMesh.scale.y += 0.01;
        // } else {
        //     this.politicsMesh.scale.x -= 0.01;
        //     this.politicsMesh.scale.y -= 0.01;  
        // }
        //console.log(this.politicsMesh.scale.x);

        // if (this.props.size < this.state.sizeTarget) {
        //     this.sportsMesh.scale.x += 0.01;
        //     this.sportsMesh.scale.y += 0.01;
        //    } else {
        //        this.sportsMesh.scale.x -= 0.01;
        //        this.sportsMesh.scale.y -= 0.01;  
        //    }
        //    console.log(this.sportsMesh.scale.x);

        this.props.count.forEach(item => {
            if (item.quantity > 0) {
                //if (item.cat === "sport") console.log("item.ratio, item.prevRatio", item.ratio, item.prevRatio);

                if (this[item.cat + "Material"].opacity !== 1) this[item.cat + "Material"].opacity = 1;
                if (item.ratio > item.prevRatio) {
                    //console.log("RASTE: item.ratio, item.prevRatio", item.ratio, item.prevRatio)
                    if (this[item.cat + "Mesh"].scale.x < item.ratio * 6) {
                        //console.log(this[item.cat + "Mesh"].scale.x);
                        this[item.cat + "Mesh"].scale.x += 0.015;
                        this[item.cat + "Mesh"].scale.y += 0.015;
                    }
                }
                if (item.ratio < item.prevRatio || this.onHoverObject.name) { // uslov: this.onHoverObject.name je da bi se objekti smanjivali ukoliko je prethodno preko njih predjeno misem. dokle god je mis na njima velicina se setuje na hardcoded vrednost 6
                    //console.log("OPADA: item.ratio, item.prevRatio", item.ratio, item.prevRatio)
                    if (this[item.cat + "Mesh"].scale.x > item.ratio * 6) {
                        if (this.onHoverObject.name && this[this.onHoverObject.name + "Material"].color !== "#0BA5AB") this[this.onHoverObject.name + "Material"].color.set("#0BA5AB"); // resetuje boju ako mis vise nije iznad objekta
                        this[item.cat + "Mesh"].scale.x -= 0.015;
                        this[item.cat + "Mesh"].scale.y -= 0.015;
                    }
                }

                // if (this.onHoverObject.name) {
                //     //     if (this[this.onHoverObject.name + "Mesh"].scale.x < 2 * parseFloat(this.onHoverObject.scale.x)) {
                //     //     console.log(`${this.onHoverObject.name} + "Mesh".scale.x, this.onHoverObject.scale.x`, this[this.onHoverObject.name + "Mesh"].scale.x, this.onHoverObject.scale.x);
                //     if (this[this.onHoverObject.name + "Mesh"].scale.x > item.ratio * 6) {
                //         this[this.onHoverObject.name + "Mesh"].scale.x -= 0.01;
                //         this[this.onHoverObject.name + "Mesh"].scale.y -= 0.01;
                //     }
                // }
            }
        });

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);

        //console.log(this.frameId);
        //if (this.frameId === 200) this.stop();
        //if (this.politicsMesh.scale.x > this.state.sizeTarget) this.stop();
    }


    renderScene = () => {

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(this.scene.children, true); // drugi argumenat je po defaultu false, a to je da rekurzivno proverava i decu objekata na koje naidje (mora biti true ako se objekti dodaju na parent koji se onda dodaje sceni!)
        //console.log(intersects.length);

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.material.opacity !== 0) { // only for visible objects
                intersects[i].object.material.color.set(0xff0000); // changes color of an obj mouse is hovering on
                intersects[i].object.scale.x = 6;
                intersects[i].object.scale.y = 6;
                //console.log(intersects[i]);
                if (this.clicked) intersects[i].object.callback();
                //console.log(intersects[i].object.geometry.parameters.text);
                // intersects[i].object.geometry.addEventListener( 'click', function ( event ) {

                //     alert( event.message );

                // } );
                this.onHoverObject = {
                    name: intersects[i].object.geometry.parameters.text,
                    // scale: {
                    //     x: `${intersects[i].object.scale.x}`,
                    //     y: `${intersects[i].object.scale.y}`,
                    //     z: `${intersects[i].object.scale.z}`,
                    // },
                    color: intersects[i].object.material.color
                };
            }

        }

        this.renderer.render(this.scene, this.camera)
    }
    render() {
        this.props.count.map(item => console.log(item.cat, item.quantity));
        let imeKategorije = "";
        if (this.state.showPopup) imeKategorije = this.onHoverObject.name;
        let popUp = (
            <div style={{ position: 'absolute', left: '100px', top: '100px', width: '800px', height: '500px', backgroundColor: '#ffffff' }}> 
            <p> {imeKategorije}    </p>
            <button style={{backgroundColor: '#4CAF50', padding: "5px", margin: '5px', display: 'inline-block'}} onClick={() => this.setState({showPopup: false})}> X </button>
            <div> {this.props.tweets.map(tweet => {
            return tweet.category === imeKategorije ? 
            <SingleTweet key={tweet.id} 
                         id={tweet.id} 
                         text={tweet.text} 
                         category={tweet.category}
                         categoryEdited={(e) => this.categorySelectedHandler(e)}/> : null})}
                         </div>
            </div>);

        return (
            <div>
                <div
                    style={{
                        //width: '1000px',
                        //height: '400px',
                        position: 'fixed',
                        top: '0px',
                        left: '0px',
                        padding: '0px',
                        margin: '0px'
                    }}
                    ref={mount => { this.mount = mount }}
                />
                {this.state.showPopup ? popUp : null}
            </div>
        )
    }
}
export default ThreeScene

// categoryEdited={(e) => categorySelectedHandler(e)}