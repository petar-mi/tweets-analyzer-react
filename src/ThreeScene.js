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
        // tweets: this.props.tweets,
        // count: this.props.count,
        showPopup: false,
        sentToServer: false,

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("componentDidUpdate");

        this.props.count.forEach(item => {

            if (item.quantity > 0 && !this[item.cat + "Geometry"]) { // stvara nove objekte samo ako je pozitivan quantity i ako vec nisu stvoreni 
                console.log(item);
                if (this.props.showSpinner) this.props.hideSpinner();
                this[item.cat + "Geometry"] = new THREE.TextGeometry(`${item.cat}`, {
                    font: this.font,
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
                this[item.cat + "Material"] = new THREE.MeshPhongMaterial({ color: "#44A1A0", transparent: true, flatShading: true }); // 44A1A0
                this[item.cat + "Material"].opacity = 0;
                this[item.cat + "Mesh"] = new THREE.Mesh(this[item.cat + "Geometry"], this[item.cat + "Material"]);
                this[item.cat + "Mesh"].position.set(item.xPosition, item.yPosition, -2); // pocetna z=-2 je da se ne bi preklapali nevidljivi sa objektima koji ce postati vidljivi nakon sto im se poveca quantity
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

            }

        });

    }


    // static getDerivedStateFromProps(props, state) {
    //     // Any time the current user changes,
    //     // Reset any parts of state that are tied to that user.
    //     // In this simple example, that's just the email.
    //     if (props.count !== state.count) {
    //         console.log("menjam state");
    //         return {
    //             count: props.count,
    //             tweets: props.tweets,
    //         };
    //     }
    //     return null;
    // }


    componentDidMount() {
        console.log("componentDidMount");
        console.log(this.props);

        //setTimeout( () => { console.log(this.props) }, 10000);




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
        this.renderer.setClearColor('#333333')
        //this.renderer.setSize(width, height);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);

        //ADD TEXT
        this.loader = new THREE.FontLoader();
        this.font = this.loader.parse(helveticaBold);




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

        // this.props.count.forEach(item => {
        //     //if (item.quantity > 0) {
        //         console.log(item);
        //         this[item.cat + "Geometry"] = new THREE.TextGeometry(`${item.cat}`, {
        //             font: this.font,
        //             //size: this.state.size,
        //             //size: this.props.count[14].ratio,
        //             size: 0.5,
        //             height: 0.15,
        //             curveSegments: 20,
        //             // bevelEnabled: true,
        //             // bevelThickness: 10,
        //             // bevelSize: 8,
        //             // bevelSegments: 5
        //         });
        //         //this[item.cat + "Material"] = new THREE.MeshBasicMaterial({ color: "#0BA5AB", transparent: true, flatShading: true });
        //         this[item.cat + "Material"] = new THREE.MeshPhongMaterial({ color: "#0BA5AB", transparent: true, flatShading: true });
        //         this[item.cat + "Material"].opacity = 0;
        //         this[item.cat + "Mesh"] = new THREE.Mesh(this[item.cat + "Geometry"], this[item.cat + "Material"]);
        //         this[item.cat + "Mesh"].position.set(item.xPosition, item.yPosition, -2); // pocetna z=-2 je da se ne bi preklapali nevidljivi sa objektima koji ce postati vidljivi nakon sto im se poveca quantity
        //         this[item.cat + "Mesh"].callback = this.objectClickHandler;



        //         //this[item.cat + "Geometry"].addEventListener( 'click', (event) => this.gogo( item.cat, event ));


        //         // *** DRUGI DEO POTREBAN ZA SFERU ****
        //         // var stick = new THREE.Object3D();
        //         // var point = new THREE.Vector3(item.sphereX, item.sphereY, 2);
        //         // stick.lookAt(point);
        //         // parent.add(stick);
        //         // stick.add(this[item.cat + "Mesh"]);
        //         // *** KRAJ DRUGOG DELA POTREBNOG ZA SFERU ****


        //         this.scene.add(this[item.cat + "Mesh"]); // zakomentarisati ako se radi sfera

        //     //}

        // });




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

        this.pointLight = new THREE.PointLight(0xdddddd);
        this.pointLight.position.set(0, 0, 10); // staviti 30 ako se radi sfera
        this.scene.add(this.pointLight);

        this.ambientLight = new THREE.AmbientLight(0x505050);
        this.scene.add(this.ambientLight);

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

        // this.props.hideSpinner();

        this.start()
    }

    intersectBool = false;

    onMouseMove = event => {
        event.preventDefault();

        mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
        mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;
        // console.log(mouse.x);
        // console.log(mouse.y);

    }

    onMouseClick = event => {
        event.preventDefault();
        console.log(event.target);
        // console.log('pre', this.clicked);
        if (this.intersectBool) { // registruje klik samo ako ima preseka sa vidljivim objektima
            this.clicked = !this.clicked;
            // console.log('Nakon', this.clicked);
        } else if (!this.intersectBool && this.state.showPopup) {
            this.setState({ showPopup: false });
        }
    }

    objectClickHandler = (event) => {
        this.clicked = !this.clicked;
        // alert (this.onHoverObject.name);
        this.setState({ showPopup: true });
    }

    objectClickHandlerSendToServer = (event) => {
        this.clicked = !this.clicked;
        if (!this.state.sentToServer) {


            this.props.sendToServer();

            this.setState({ sentToServer: true }); // salje tvitove nazad na server putem funkcije koja se nalazi u parent component

            // na ovaj nacin se brise zeljeni objekat
            for (let i = 0; i < this.scene.children.length; i++) {
                if (this.scene.children[i].geometry && this.scene.children[i].geometry.parameters.text === "SEND ALL BACK TO SERVER") {
                    this.scene.remove(this.scene.children[i]);
                }
            }
            // zatim kreiramo novi objekat sa izmenjenim tekstom
            this.sendToServerSentGeometry = new THREE.TextGeometry('                  SENT', { font: this.font, size: 0.5, height: 0.15, curveSegments: 20 });
            this.sendToServerSentMaterial = new THREE.MeshPhongMaterial({ color: "#f79d01", transparent: true, flatShading: true });
            this.sendToServerSentMaterial.opacity = 1;
            this.sendToServerSentMesh = new THREE.Mesh(this.sendToServerSentGeometry, this.sendToServerSentMaterial);
            this.sendToServerSentMesh.position.set(-2.5, -4.75, 0);
            this.scene.add(this.sendToServerSentMesh);
        };
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

        //console.log("Animating...");

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
            if (item.quantity > 0 && this[item.cat + "Mesh"]) {
                //if (item.cat === "sport") console.log("item.ratio, item.prevRatio", item.ratio, item.prevRatio);
                if (this[item.cat + "Mesh"].position.z !== 0) this[item.cat + "Mesh"].position.z = 0;
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
                        if (this.onHoverObject.name && this[this.onHoverObject.name + "Material"].color !== "#44A1A0") this[this.onHoverObject.name + "Material"].color.set("#44A1A0"); // resetuje boju ako mis vise nije iznad objekta
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
            if (item.quantity === 0 && this[item.cat + "Material"]) { // objekat ponovo postaje proziran ukoliko je quantity === 0 i vraca se na z poziciju -2 da se ne bi preklapao sa vidljivim
                this[item.cat + "Material"].opacity = 0;
                this[item.cat + "Mesh"].position.z = -2;
            }

        });

        if (this.props.showToServerButton && !this.sendToServerGeometry) { // kada poslednji analizirani tweet stigne sa servera u parent component kreiramo objekat SEND ALL BACK TO SERVER 

            this.sendToServerGeometry = new THREE.TextGeometry("SEND ALL BACK TO SERVER", { font: this.font, size: 0.5, height: 0.15, curveSegments: 20 });
            this.sendToServerMaterial = new THREE.MeshPhongMaterial({ color: "#e6b800", transparent: true, flatShading: true });
            this.sendToServerMaterial.opacity = 1;
            this.sendToServerMesh = new THREE.Mesh(this.sendToServerGeometry, this.sendToServerMaterial);
            this.sendToServerMesh.position.set(-2.5, -4.75, 0);
            this.sendToServerMesh.callback = this.objectClickHandlerSendToServer;
            this.scene.add(this.sendToServerMesh);
        }

        // if (this.state.sendToServer) {
        //     this.sendToServerMaterial.color.set('#806600');
        //     //console.log(this.sendToServerGeometry);      
        //}
        // if (this.state.sentToServer) {console.log("animateHERE"); this.scene.remove(this.scene.children[35]);}

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);

        //console.log(this.frameId);
        //if (this.frameId === 200) this.stop();
        //if (this.politicsMesh.scale.x > this.state.sizeTarget) this.stop();
    }


    renderScene = () => {



        // if (this.state.sentToServer) { // brise objekat i stvara novi
        //     for (let i = 0; i < this.scene.children.length; i++) { 
        //         if (this.scene.children[i].geometry && this.scene.children[i].geometry.parameters.text === "SEND ALL BACK TO SERVER") this.scene.remove(this.scene.children[i]);
        //     }
        //     this.sendToServerSentGeometry = new THREE.TextGeometry("         SENT", { font: this.font, size: 0.5, height: 0.15, curveSegments: 20 });
        //     this.sendToServerSentMaterial = new THREE.MeshPhongMaterial({ color: "#f79d01", transparent: true, flatShading: true });
        //     this.sendToServerSentMaterial.opacity = 1;
        //     this.sendToServerSentMesh = new THREE.Mesh(this.sendToServerSentGeometry, this.sendToServerSentMaterial);
        //     this.sendToServerSentMesh.position.set(-2.5, -4.75, 0);
        //     this.scene.add(this.sendToServerSentMesh);
        // }

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(this.scene.children, true); // drugi argumenat je po defaultu false, a to je da rekurzivno proverava i decu objekata na koje naidje (mora biti true ako se objekti dodaju na parent koji se onda dodaje sceni!)
        //console.log(intersects.length);

        //sledeci red ispituje da li se u nizu preseka nalazi vidljivi objekat i onda javascipt some() funkcija vraca true, inace vraca flase, kao i u slucaju da preseka ni nema (intersects.length <= 0)       
        intersects.length > 0 ? this.intersectBool = intersects.some(intersect => intersect.object.material.opacity !== 0) : this.intersectBool = false;

        if (intersects.length === 0 && this.sendToServerMaterial && this.sendToServerMaterial.color.set !== "#e6b800") this.sendToServerMaterial.color.setHex(0xE6B800); // resetuje boju objekta SEND ALL BACK TO SERVER ako mis nije iznad njega

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.material.opacity !== 0) { // only for visible objects
                // changes color and size of an obj mouse is hovering on
                if (intersects[i].object.geometry.parameters.text !== 'SEND ALL BACK TO SERVER' && intersects[i].object.geometry.parameters.text !== '                  SENT') { // uvecavanje text onHover ne vazi za SEND ALL BACK TO SERVER
                    // console.log(intersects[i].object.material);
                    intersects[i].object.material.color.setHex(0xff0000);
                    intersects[i].object.scale.x = 3.5;
                    intersects[i].object.scale.y = 3.5;
                    if (this.clicked) { // 
                        this.intersectBool = false; // resetuje flag za klik
                        intersects[i].object.callback();
                    }
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

                if (intersects[i].object.geometry.parameters.text === 'SEND ALL BACK TO SERVER') {
                    intersects[i].object.material.color.setHex(0xff0000);
                    if (this.clicked) { // 
                        this.intersectBool = false; // resetuje flag za klik
                        // intersects[i].object.material.color.set('#4faead');
                        intersects[i].object.callback();
                    }
                }

            }

        }

        this.renderer.render(this.scene, this.camera)
    }

    render() {

        this.props.count.map(item => console.log("item.cat, item.quantity, item.ratio, item.prevRatio", item.cat, item.quantity, item.ratio, item.prevRatio));
        let imeKategorije = "";
        let imeKategorijeCamelized = ""
        if (this.state.showPopup) {

            imeKategorije = this.onHoverObject.name;

            imeKategorijeCamelized = this.onHoverObject.name.replace(/\w+/g, function (match) {
                return match.charAt(0).toUpperCase() + match.substring(1).toLowerCase();
            });
        }

        let popUp = (
            <div style={{ margin: 'auto', position: 'relative', width: '800px', height: '500px', backgroundColor: '#404040', opacity: '0.95' }}>
                <div>
                <button style={{ backgroundColor: '#404040', color: '#e6e6e6', padding: "5px", margin: '15px', float: 'right', cursor: 'pointer' }} onClick={() => this.setState({ showPopup: false })}> X </button>
                    <div style={{ textAlign: 'center', margin: 'auto', padding: "20px 0 0 20px", color: '#FFCA3A', fontSize: '2em', width: '90%' }}>
                        <div style={{ display: 'inline-block' }}>
                            <strong >{imeKategorijeCamelized}</strong>
                            <p style={{ fontSize: 'small', margin: 'auto', paddingTop: '10px' }}>(Click on a tweet to open/close category selection)</p>
                        </div>
                    </div>
                    
                </div>
                <div style={{ clear: 'right', paddingTop: '20px', color: '#e6e6e6', textAlign: 'center' }}> {this.props.tweets.map(tweet => {
                    return tweet.category === imeKategorije ?
                        <SingleTweet
                            key={tweet.id}
                            id={tweet.id}
                            text={tweet.text}
                            category={tweet.category}
                            count={this.props.count}
                            categoryEdited={(e) => this.categorySelectedHandler(e)} /> : null
                })}
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