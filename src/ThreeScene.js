import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import helveticaBold from './helvetiker_bold.typeface.json';
import SingleTweet from './SingleTweet';
import styles from './styles/ThreeScene.module.css';

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

class ThreeScene extends Component {
    state = {
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
                    size: 0.5,
                    height: 0.15,
                    curveSegments: 20,
                    // bevelEnabled: true,
                    // bevelThickness: 10,
                    // bevelSize: 8,
                    // bevelSegments: 5
                });
                this[item.cat + "Material"] = new THREE.MeshPhongMaterial({ color: "#44A1A0", transparent: true, flatShading: true }); // 44A1A0
                this[item.cat + "Material"].opacity = 0;
                this[item.cat + "Mesh"] = new THREE.Mesh(this[item.cat + "Geometry"], this[item.cat + "Material"]);
                this[item.cat + "Mesh"].position.set(item.xPosition, item.yPosition, -2); // pocetna z=-2 je da se ne bi preklapali nevidljivi sa objektima koji ce postati vidljivi nakon sto im se poveca quantity
                this[item.cat + "Mesh"].callback = this.objectClickHandler;

                this.scene.add(this[item.cat + "Mesh"]); 
            }
        });
    }

    componentDidMount() {
        // console.log("componentDidMount");
        // console.log(this.props);
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.z = 8;
 
        console.log("this.camera.position.x, this.camera.position.y, this.camera.position.z", this.camera.position.x, this.camera.position.y, this.camera.position.z);
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#333333')
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);

        //ADD TEXT
        this.loader = new THREE.FontLoader();
        this.font = this.loader.parse(helveticaBold);

        this.pointLight = new THREE.PointLight(0xdddddd);
        this.pointLight.position.set(0, 0, 10); // staviti 30 ako se radi sfera
        this.scene.add(this.pointLight);

        this.ambientLight = new THREE.AmbientLight(0x505050);
        this.scene.add(this.ambientLight);

        window.addEventListener('resize', this.onWindowResize, false);

        this.mount.addEventListener('mousemove', event => this.onMouseMove(event), false); // omogucava funkcionalnost raycaster-a

        this.mount.addEventListener('click', event => this.onMouseClick(event), false);

        new OrbitControls(this.camera, this.renderer.domElement); // kontrolise rotacije i zoom pomocu misa, (ne mora da se dodeli nekoj promenjivoj da bi radilo)

        this.onHoverObject = {};

        this.clicked = false;

        this.start()
    }

    intersectBool = false;

    onMouseMove = event => {
        event.preventDefault();
        mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
        mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;
    }

    onMouseClick = event => {
        event.preventDefault();
        console.log(event.target);
        if (this.intersectBool) { // registruje klik samo ako ima preseka sa vidljivim objektima
            this.clicked = !this.clicked;
        } else if (!this.intersectBool && this.state.showPopup) {
            this.setState({ showPopup: false });
        }
    }

    objectClickHandler = (event) => {
        this.clicked = !this.clicked;
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
        this.props.count.forEach(item => {
            if (item.quantity > 0 && this[item.cat + "Mesh"]) {
                if (this[item.cat + "Mesh"].position.z !== 0) this[item.cat + "Mesh"].position.z = 0;
                if (this[item.cat + "Material"].opacity !== 1) this[item.cat + "Material"].opacity = 1;
                if (item.ratio > item.prevRatio) {
                    if (this[item.cat + "Mesh"].scale.x < item.ratio * 6) {
                        this[item.cat + "Mesh"].scale.x += 0.015;
                        this[item.cat + "Mesh"].scale.y += 0.015;
                    }
                }
                if (item.ratio < item.prevRatio || this.onHoverObject.name) { // uslov: this.onHoverObject.name je da bi se objekti smanjivali ukoliko je prethodno preko njih predjeno misem. dokle god je mis na njima velicina se setuje na hardcoded vrednost 6
                    if (this[item.cat + "Mesh"].scale.x > item.ratio * 6) {
                        if (this.onHoverObject.name && this[this.onHoverObject.name + "Material"].color !== "#44A1A0") this[this.onHoverObject.name + "Material"].color.set("#44A1A0"); // resetuje boju ako mis vise nije iznad objekta
                        this[item.cat + "Mesh"].scale.x -= 0.015;
                        this[item.cat + "Mesh"].scale.y -= 0.015;
                    }
                }
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

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene = () => {
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(this.scene.children, true); // drugi argumenat je po defaultu false, a to je da rekurzivno proverava i decu objekata na koje naidje (mora biti true ako se objekti dodaju na parent koji se onda dodaje sceni!)

        //sledeci red ispituje da li se u nizu preseka nalazi vidljivi objekat i onda javascipt some() funkcija vraca true, inace vraca flase, kao i u slucaju da preseka ni nema (intersects.length <= 0)       
        intersects.length > 0 ? this.intersectBool = intersects.some(intersect => intersect.object.material.opacity !== 0) : this.intersectBool = false;

        if (intersects.length === 0 && this.sendToServerMaterial && this.sendToServerMaterial.color.set !== "#e6b800") this.sendToServerMaterial.color.setHex(0xE6B800); // resetuje boju objekta SEND ALL BACK TO SERVER ako mis nije iznad njega

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.material.opacity !== 0) { // only for visible objects
                // changes color and size of an obj mouse is hovering on
                if (intersects[i].object.geometry.parameters.text !== 'SEND ALL BACK TO SERVER' && intersects[i].object.geometry.parameters.text !== '                  SENT') { // uvecavanje text onHover ne vazi za SEND ALL BACK TO SERVER
                    intersects[i].object.material.color.setHex(0xff0000);
                    intersects[i].object.scale.x = 3.5;
                    intersects[i].object.scale.y = 3.5;
                    if (this.clicked) { // 
                        this.intersectBool = false; // resetuje flag za klik
                        intersects[i].object.callback();
                    }
                    this.onHoverObject = {
                        name: intersects[i].object.geometry.parameters.text,
                        color: intersects[i].object.material.color
                    };
                }

                if (intersects[i].object.geometry.parameters.text === 'SEND ALL BACK TO SERVER') {
                    intersects[i].object.material.color.setHex(0xff0000);
                    if (this.clicked) { // 
                        this.intersectBool = false; // resetuje flag za klik
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
            <div className={styles.popup}>
                <div>
                <button className={styles.closePopupButton} onClick={() => this.setState({ showPopup: false })}> X </button>
                    <div className={styles.categoryHeading}>
                        <div style={{ display: 'inline-block' }}>
                            <strong >{imeKategorijeCamelized}</strong>
                            <p className={styles.categorySubtitleNote}>(Click on a tweet to open/close category selection)</p>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.tweetsList}> {this.props.tweets.map(tweet => {
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
                <div className={styles.canvas}
                     ref={mount => { this.mount = mount }}
                />
                {this.state.showPopup ? popUp : null}
            </div>
        )
    }
}
export default ThreeScene;
