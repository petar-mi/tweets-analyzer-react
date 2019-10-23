import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import helveticaBold from './helvetiker_bold.typeface.json';
import SingleTweet from './SingleTweet';
import styles from './styles/ThreeScene.module.css';


class ThreeScene extends Component {
    state = {
        showPopup: false,
        sentToServer: false,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.count.forEach(item => {
            if (item.quantity > 0 && !this[item.cat + "Geometry"]) { // creates new objects only when a category contains tweets (item.quantity > 0) and if they haven't been created already 
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
                this[item.cat + "Material"] = new THREE.MeshPhongMaterial({ color: "#44A1A0", transparent: true, flatShading: true }); 
                this[item.cat + "Material"].opacity = 0;
                this[item.cat + "Mesh"] = new THREE.Mesh(this[item.cat + "Geometry"], this[item.cat + "Material"]);
                this[item.cat + "Mesh"].position.set(item.xPosition, item.yPosition, -2); // sets intital z=-2 for the invisible objects not to interfere with the visible ones (probably unnecessery now, since not all the objects are created initially, but only when they containt tweets)
                this[item.cat + "Mesh"].callback = this.objectClickHandler;

                this.scene.add(this[item.cat + "Mesh"]); 
            }
        });
    }

    componentDidMount() {

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
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
        this.pointLight.position.set(0, 0, 10); 
        this.scene.add(this.pointLight);

        this.ambientLight = new THREE.AmbientLight(0x505050);
        this.scene.add(this.ambientLight);

        window.addEventListener('resize', this.onWindowResize, false);

        this.mount.addEventListener('mousemove', event => this.onMouseMove(event), false); // enables raycaster functionality

        this.mount.addEventListener('click', event => this.onMouseClick(event), false);

        new OrbitControls(this.camera, this.renderer.domElement); // controls scene rotation and zoom, works just like this (no need to be stored as a const/var)

        this.onHoverObject = {};

        this.clicked = false;

        this.start()
    }

    intersectBool = false;

    onMouseMove = event => {
        event.preventDefault();
        this.mouse.x = ((event.clientX - this.mount.offsetLeft) / this.mount.clientWidth) * 2 - 1;
        this.mouse.y = - ((event.clientY - this.mount.offsetTop) / this.mount.clientHeight) * 2 + 1;
    }

    onMouseClick = event => {
        event.preventDefault();
        console.log(event.target);
        if (this.intersectBool) { // registers a click only when there is an intersection with visible objects
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

            this.props.sendToServer(); // sends tweets back to server using function from parent component

            this.setState({ sentToServer: true }); 

            
            for (let i = 0; i < this.scene.children.length; i++) { // iterates scene objects and deletes an object with specified geometry
                if (this.scene.children[i].geometry && this.scene.children[i].geometry.parameters.text === "SEND ALL BACK TO SERVER") {
                    this.scene.remove(this.scene.children[i]);
                }
            }
            // then a new object is created with a different string
            this.sendToServerSentGeometry = new THREE.TextGeometry('                  SENT', { font: this.font, size: 0.5, height: 0.15, curveSegments: 20 });
            this.sendToServerSentMaterial = new THREE.MeshPhongMaterial({ color: "#f79d01", transparent: true, flatShading: true });
            this.sendToServerSentMaterial.opacity = 1;
            this.sendToServerSentMesh = new THREE.Mesh(this.sendToServerSentGeometry, this.sendToServerSentMaterial);
            this.sendToServerSentMesh.position.set(-2.5, -4.75, 0);
            this.scene.add(this.sendToServerSentMesh);
        };
    }

    categorySelectedHandler = (e) => {
        console.log("Logging from ThreeScene.js: " + e.tweet.text + " " + e.tweet.id + " " + e.tweet.categoryInput);
        console.log("Category entered manually: " + e.newCat);
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
                if (item.ratio < item.prevRatio || this.onHoverObject.name) { // condition: this.onHoverObject.name is set so that objects' size decreases if the mouse previously hoverd above them. As long as the mouse hovers over them their size is set to * 6
                    if (this[item.cat + "Mesh"].scale.x > item.ratio * 6) {
                        if (this.onHoverObject.name && this[this.onHoverObject.name + "Material"].color !== "#44A1A0") this[this.onHoverObject.name + "Material"].color.set("#44A1A0"); // resets the color if the mouse is not hovering above the object anymore
                        this[item.cat + "Mesh"].scale.x -= 0.015;
                        this[item.cat + "Mesh"].scale.y -= 0.015;
                    }
                }
            }
            if (item.quantity === 0 && this[item.cat + "Material"]) { // object becomes invisible if quantity drops to 0 and gets positioned behind (z = -2) // should better be deleted instead
                this[item.cat + "Material"].opacity = 0;
                this[item.cat + "Mesh"].position.z = -2;
            }
        });

        if (this.props.showToServerButton && !this.sendToServerGeometry) { // when the last analysed tweets arrives from the server to parent component SEND ALL BACK TO SERVER object is created

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
        
        this.raycaster.setFromCamera(this.mouse, this.camera); // update the picking ray with the camera and mouse position

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children, true); // second argument decides recursively going through intersection object's children and must be set to true in this case (default value is false)

        // using some() function checks if intersection array contains visible objects        
        intersects.length > 0 ? this.intersectBool = intersects.some(intersect => intersect.object.material.opacity !== 0) : this.intersectBool = false;

        if (intersects.length === 0 && this.sendToServerMaterial && this.sendToServerMaterial.color.set !== "#e6b800") this.sendToServerMaterial.color.setHex(0xE6B800); // resets SEND ALL BACK TO SERVER object color if mouse is not hovering above it

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.material.opacity !== 0) { // only for visible objects
                // changes color and size of an object mouse is hovering above
                if (intersects[i].object.geometry.parameters.text !== 'SEND ALL BACK TO SERVER' && intersects[i].object.geometry.parameters.text !== '                  SENT') { // uvecavanje text onHover ne vazi za SEND ALL BACK TO SERVER
                    intersects[i].object.material.color.setHex(0xff0000);
                    intersects[i].object.scale.x = 3.5;
                    intersects[i].object.scale.y = 3.5;
                    if (this.clicked) { // 
                        this.intersectBool = false; // resets click bool
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
                        this.intersectBool = false; // resets click bool
                        intersects[i].object.callback();
                    }
                }
            }
        }
        this.renderer.render(this.scene, this.camera)
    }

    render() {

        this.props.count.map(item => console.log("item.cat, item.quantity, item.ratio, item.prevRatio", item.cat, item.quantity, item.ratio, item.prevRatio));
        let categoryName = "";
        let categoryNameCamelized = ""
        if (this.state.showPopup) {

            categoryName = this.onHoverObject.name;

            categoryNameCamelized = this.onHoverObject.name.replace(/\w+/g, function (match) {
                return match.charAt(0).toUpperCase() + match.substring(1).toLowerCase();
            });
        }

        let popUp = (
            <div className={styles.popup}>
                <div>
                <button className={styles.closePopupButton} onClick={() => this.setState({ showPopup: false })}> X </button>
                    <div className={styles.categoryHeading}>
                        <div style={{ display: 'inline-block' }}>
                            <strong >{categoryNameCamelized}</strong>
                            <p className={styles.categorySubtitleNote}>(Click on a tweet to open/close category selection)</p>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.tweetsList}> {this.props.tweets.map(tweet => {
                    return tweet.category === categoryName ?
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
