/**
 VIEWER
 Implements Threejs viewer.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Main viewer class.
 *
 * @class
 * @constructor
 */
function TMSViewer() {
    /* eslint-disable arrow-parens */
    /* eslint-disable newline-per-chained-call */
    /* eslint-disable no-extra-parens */
    /* eslint-disable no-mixed-operators */

    /**
     * ------------------------------------------------------------------------
     * Viewer variables
     * ------------------------------------------------------------------------
     */

    /**
     * Canvas ID.
     * @type {string}
     * @private
     */
    this.id = generateID();

    /**
     * DIV canvas.
     * @type {JQuery | jQuery | HTMLElement | null}
     * @protected
     */
    this._canvasParent = null;

    /**
     * Object pointer.
     * @type {TMSViewer}
     */
    let self = this;

    /**
     * GUI ID.
     * @type {object | string}
     * @protected
     */
    this._guiID = 'viewer-gui';

    /**
     * Viewer mesh.
     * @type {Mesh | null}
     * @private
     */
    this._viewerMesh = null;


    /**
     * ------------------------------------------------------------------------
     * Three.js objects
     * ------------------------------------------------------------------------
     */

    /**
     * Animation is active.
     * @type {boolean}
     * @private
     */
    this._animateThread = false;

    /**
     * Three.js helpers.
     * @protected
     */
    this._threejs_helpers = {

        /**
         * Status
         */
        axis: false,                    // Show axis
        cameratarget: false,            // Show camera target
        fpsmeter: false,                // Show fps
        grid: false,                    // Show grid plane
        gui: false,                     // Show GUI
        normals: false,                 // Show normals
        planes: false,                  // Show planes
        worldlimits: false,             // Show world limits

        /**
         * Helpers params
         */
        axissize: 0.40,                 // Axis sizes
        cameratargetcolor: 0X0000ff,    // Color target
        cameratargetsize: 0.05,         // Size target
        griddist: 0.03,                 // Grid distance in percentage
        guicloseafterpopup: false,      // GUI closes after an popup
        guistartclosed: true,           // GUI starts closed
        normalcolor: 0xff0000,          // Normal color
        planecolorx: 0X0000ff,          // X plane color
        planecolory: 0Xff0000,          // Y plane color
        planecolorz: 0X00ff00,          // Z plane color
        planeopacity: 0.5,              // Plane opacity
        worldlimitscolor: 0X444444,     // World limits color

    };

    /**
     * Contains helpers updates.
     * @type {Array}
     * @private
     */
    this._helpersUpdate = [];

    /**
     * Helpers instances @drawHelpers.
     * @private
     */
    this._helperInstances = {
        axis: null,
        cameratarget: null,
        fpsmeter: null,
        grid: null,
        planes: null,
        worldlimits: null,
    };

    /**
     * Global names.
     * @protected
     */
    this._globals = {
        contour: '__CONTOUR',
        helper: '__HELPER',
        normals: '__NORMALS',
        plane: '__PLANE',
        volume: 'VOLUME',
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Object properties.
     */
    this.objects_props = {

        /**
         * Camera
         */
        camera: {
            angle: 56,                          // FOV
            autorotate: false,                  // Auto rotates the camera
            far: 9.000,                         // Far plane
            light: {                            // Light color on the camera
                color: 0x7f7f7f,
                decay: 1.400,
                distance: 4.200,
                intensity: 0.740,
            },
            maxdistance: 2.500,                 // Maximum distance
            maxpolarangle: Math.PI,             // Max polar angle
            near: 0.001,                        // Close plane
            nopan: true,                        // Mouse pan
            posx: 2.300,                        // Initial X position
            posy: -2.30,                        // Initial Y position
            posz: 2.000,                        // Initial Z position
            rotationx: -1.000,                  // Initial X rotation
            rotationy: -1.300,                  // Initial Y rotation
            rotationz: -0.500,                  // Initial Z rotation
            target: {                           // Camera target
                x: 0.000,
                y: 0.000,
                z: 0.000,
            },
            targetMoveCamera: true,             // Move camera target
            targetMoveCameraFlipByPos: true,    // Inverse camera target
            targetSpeed: {                      // Target speed
                angular: 0.05,
                x: 0.020,
                y: 0.020,
                z: 0.020,
            },
            zoom: 1.000,                        // Zoom factor
        },

        /**
         * Ambient light
         */
        ambientlight: {
            color: 0x141414,
            intensity: 1.000,
        },

        /**
         * Puntual light
         */
        light: {
            angle: 1.600,
            color: 0xffffff,
            decay: 1.600,
            distance: 0.793,
            intensity: 0.000,
            penumbra: 0.580,
            planeshadow: false,
            pos: {
                x: 0.000,
                y: 0.000,
                z: 1.000,
            },
        },

        /**
         * Fog
         */
        fog: {
            color: 0x131313,
            density: 0.00024,
            enabled: true,
        },

        /**
         * Tooltip
         */
        tooltip: {
            addMode: function (m) {             // Adds an mode, functions that take intersected object
                let $f = m.__eval;
                if (notNullUndf($f)) self.objects_props.tooltip.modes.push($f);
            },
            container: 'viewer',                // Viewer ID
            enabled: false,                     // Check if tooltip is enabled or not
            ignoreEmpty: true,                  // If content is empty then tooltip dont show
            left: 20,                           // Tooltip lateral offset
            mode: {

                // Group mode, uses faces
                group: {
                    addContainer: function (container, name) { // Adds an group
                        self.objects_props.tooltip.mode.group.__groups.push(container);
                        self.objects_props.tooltip.mode.group.__names[container] = name;
                    },
                    __names: {}, // Store names
                    __groups: [], // Store groups
                    __eval: function (intersects) {

                        // Check first intersected object, must be opaque (not transparent)
                        try {
                            for (let i = 0; i < intersects.length; i += 1) {
                                if (self.objects_props.tooltip.mode.group.__groups.indexOf(intersects[i].object.name) !== -1 && intersects[i].object.material[intersects[i].face.materialIndex].opacity !== 0) {
                                    return self.objects_props.tooltip.mode.group.__names[intersects[i].object.name][intersects[i].face.materialIndex];
                                }
                            }
                        } catch ($e) {
                        } finally {
                        }
                        return '';

                    }
                },

                // Mesh group, takes object
                mesh: {
                    addIgnore: function (name) { // Ignored mesh
                        if (self.objects_props.tooltip.mode.mesh.__ignored.indexOf(name) === -1) {
                            self.objects_props.tooltip.mode.mesh.__ignored.push(name);
                        }
                    },
                    delIgnore: function (name) { // Delete ignored mesh
                        let $indx = self.objects_props.tooltip.mode.mesh.__ignored.indexOf(name);
                        if ($indx !== -1) {
                            self.objects_props.tooltip.mode.mesh.__ignored.splice($indx, 1);
                        }
                    },
                    __eval: function (intersects) {

                        // Check first intersected object, must be opaque (not transparent)
                        try {
                            for (let i = 0; i < intersects.length; i += 1) {
                                if (self.objects_props.tooltip.mode.mesh.__ignored.indexOf(intersects[i].object.name) === -1 && intersects[i].object.material.opacity !== 0) {
                                    return intersects[i].object.name;
                                }
                            }
                        } catch ($e) {
                        } finally {
                        }
                        return '';

                    },
                    __ignored: [this._globals.plane, this._globals.contour, this._globals.helper],
                }
            },
            modes: [],                          // Update modes
            tooltipClass: 'viewer-tooltip',     // Tooltip class
            top: -12,                           // Vertical tooltip offset
        },

    };

    /**
     * World limits.
     * @type {{x: number, y: number, z: number}}
     */
    this.worldsize = {
        x: 1.000,
        y: 1.000,
        z: 1.000,
    };

    /**
     * Collaidable meshes list.
     * @type {Array}
     * @private
     */
    this._collaidableMeshes = [];


    /**
     * ------------------------------------------------------------------------
     * Textures
     * ------------------------------------------------------------------------
     */

    /**
     * Texture loader.
     * @type {TextureLoader}
     * @private
     */
    this._textureLoader = new THREE.TextureLoader();
    self._textureLoader.setPath('resources/tiles/');

    /**
     * Store images.
     */
    this.images = {};

    /**
     * Load image.
     *
     * @function
     * @param {string} image
     * @private
     */
    this._load_image = function (image) {
        let $f = function () {
            self.render();
        };
        this.images[image] = self._textureLoader.load('{0}.png'.format(image), $f);
        this.images[image + '_ambient'] = self._textureLoader.load('{0}_ambient.png'.format(image), $f);
        this.images[image + '_normal'] = self._textureLoader.load('{0}_normal.png'.format(image), $f);
        this.images[image + '_specular'] = self._textureLoader.load('{0}_specular.png'.format(image), $f);
    };
    let _$textures = [
        'bomb', 'disabled', 'flag', 'question', 'tile_0', 'tile_1', 'tile_2',
        'tile_3', 'tile_4', 'tile_5', 'tile_6', 'tile_7', 'tile_8', 'unopened'
    ];
    for (let i = 0; i < _$textures.length; i += 1) {
        this._load_image(_$textures[i]);
    }


    /**
     * ------------------------------------------------------------------------
     * Viewer game variables
     * ------------------------------------------------------------------------
     */

    /**
     * Volume object.
     * @type {Volume | null}
     * @private
     */
    this._volume = null;

    /**
     * Game palette.
     */
    this.palette = {
        contour_major_color: 0x444444,
        contour_major_opacity: 1,
        contour_minor_color: 0x000000,
        contour_minor_opacity: 1,
        face_color_played: new THREE.Color(0x777777),
        face_color_unplayed: new THREE.Color(0xffffff),
        face_hover_played: new THREE.Color(0x000000), // Emissive
        face_hover_unplayed: new THREE.Color(0x555555), // Emissive
        face_shininess_played: 0,
        face_shininess_unplayed: 40,
        face_specular: 0x101010,
        face_unhover_played: new THREE.Color(0x000000), // Emissive
        face_unhover_unplayed: new THREE.Color(0x050505), // Emissive
    };


    /**
     * ------------------------------------------------------------------------
     * Viewer methods, general functions
     * ------------------------------------------------------------------------
     */

    /**
     * Resize canvas.
     *
     * @function
     * @param {boolean} type - If true add event, false deletes
     */
    this.threeResize = function (type) {

        /**
         * Event name
         * @type {string}
         */
        let $ev = 'resize.shaderviewer' + this.id;

        /**
         * Enables event
         */
        if (type) {
            let $f = function (e) {

                /**
                 * Prevents other changes
                 */
                if (notNullUndf(e)) e.preventDefault();

                /**
                 * Get DIV width and height
                 */
                let $w = Math.ceil(getElementWidth(self.maindiv));
                let $h = Math.ceil(getElementHeight(self.maindiv));

                /**
                 * Updates canvas aspect
                 */
                self.objects_props.camera.aspect = $w / $h;

                /**
                 * Updates Three.js
                 */
                self._three_camera.aspect = $w / $h;
                self._three_camera.updateProjectionMatrix();
                self._renderer.setSize($w, $h); // Actualiza el render
                self._renderer.setPixelRatio(window.devicePixelRatio);

                /**
                 * Redraw
                 */
                self.animateFrame();

            };
            app_dom.window.on($ev, $f);
            $f();
        }

        /**
         * Disable event
         */
        else {
            app_dom.window.off($ev);
        }

    };

    /**
     * Init Three.js.
     *
     * @function
     * @private
     */
    this._initThree = function () {

        /**
         * --------------------------------------------------------------------
         * Update world limits
         * --------------------------------------------------------------------
         */
        this.worldsize.diagl = Math.sqrt(Math.pow(2 * this.worldsize.x, 2) +
            Math.pow(2 * this.worldsize.y, 2) + Math.pow(this.worldsize.z, 2));
        this.worldsize.diagx = Math.sqrt(Math.pow(2 * this.worldsize.x, 2) +
            Math.pow(this.worldsize.z, 2));
        this.worldsize.diagy = Math.sqrt(Math.pow(2 * this.worldsize.y, 2) +
            Math.pow(this.worldsize.z, 2));

        /**
         * --------------------------------------------------------------------
         * Set camera
         * --------------------------------------------------------------------
         */

        // Camera restrictions
        this.objects_props.camera.far *= this.worldsize.diagl;
        this.objects_props.camera.maxdistance *= this.worldsize.diagl;
        this.objects_props.camera.maxpolarangle *= Math.PI / 2;

        // Initial position
        this.objects_props.camera.posx *= this.worldsize.x;
        this.objects_props.camera.posy *= this.worldsize.y;
        this.objects_props.camera.posz *= this.worldsize.z;

        // Initial rotation
        this.objects_props.camera.rotationx *= Math.PI / 2;
        this.objects_props.camera.rotationy *= Math.PI / 2;
        this.objects_props.camera.rotationz *= Math.PI / 2;

        // Camera target
        this.objects_props.camera.target.x *= this.worldsize.x;
        this.objects_props.camera.target.y *= this.worldsize.y;
        this.objects_props.camera.target.z *= this.worldsize.z;

        // Target speed
        this.objects_props.camera.targetSpeed.x *= this.worldsize.x;
        this.objects_props.camera.targetSpeed.y *= this.worldsize.y;
        this.objects_props.camera.targetSpeed.z *= this.worldsize.z;
        this.objects_props.camera.targetSpeed.xy = this.dist2(this.objects_props.camera.targetSpeed.x, this.objects_props.camera.targetSpeed.y);

        // Add camera position to target
        this.objects_props.camera.posx += this.objects_props.camera.target.x;
        this.objects_props.camera.posy += this.objects_props.camera.target.y;
        this.objects_props.camera.posz += this.objects_props.camera.target.z;

        // Initial camera position
        self.objects_props.camera.initialTarget = {
            x: this.objects_props.camera.target.x,
            y: this.objects_props.camera.target.y,
            z: this.objects_props.camera.target.z
        };

        /**
         * --------------------------------------------------------------------
         * Set light properties
         * --------------------------------------------------------------------
         */
        this.objects_props.camera.light.distance *= this.worldsize.diagl;
        this.objects_props.light.distance *= this.worldsize.diagl;
        this.objects_props.light.pos.x *= this.worldsize.x;
        this.objects_props.light.pos.y *= this.worldsize.y;
        this.objects_props.light.pos.z *= this.worldsize.z;

        /**
         * --------------------------------------------------------------------
         * Init Three.js render
         * --------------------------------------------------------------------
         */
        this._renderer = new THREE.WebGLRenderer({

            // Enable transparency
            alpha: true,

            // Antialias
            antialias: true,

            // 16 bits depth buffer
            depth: true,

            // Depth buffer logarithmic
            logarithmicDepthBuffer: false,

            // WebGL power preference 'high-performance', 'low-power' or 'default'
            powerPreference: 'default',

            // Precision
            precision: 'highp',

            // Color have transparency
            premultipliedAlpha: true,

            // To captures
            preserveDrawingBuffer: false,

            // 8 bits stencil
            stencil: false,

        });

        /**
         * --------------------------------------------------------------------
         * Create scene
         * --------------------------------------------------------------------
         */
        this._scene = new THREE.Scene();
        this._scene.name = 'VIEWER-3D-SCENE';

        /**
         * --------------------------------------------------------------------
         * Static light
         * --------------------------------------------------------------------
         */
        this._light = new THREE.SpotLight();
        this._light.castShadow = true;
        this._light.color.setHex(self.objects_props.light.color);
        this._light.decay = self.objects_props.light.decay;
        this._light.distance = this.worldsize.diagl;
        this._light.intensity = self.objects_props.light.intensity;
        this._light.penumbra = self.objects_props.light.penumbra;
        this._light.angle = self.objects_props.light.angle;
        // noinspection JSSuspiciousNameCombination
        this._light.position.x = this.objects_props.light.pos.y;
        this._light.position.y = this.objects_props.light.pos.z;
        this._light.position.z = this.objects_props.light.pos.x;
        this._light.shadow.mapSize.height = 512;
        this._light.shadow.mapSize.width = 512;
        this._scene.add(this._light);

        /**
         * --------------------------------------------------------------------
         * Set fog
         * --------------------------------------------------------------------
         */
        this._fog = new THREE.FogExp2(this.objects_props.fog.color, this.objects_props.fog.density);
        if (this.objects_props.fog.enabled) {
            this._scene.fog = this._fog;
        }

        /**
         * --------------------------------------------------------------------
         * Ambiental light
         * --------------------------------------------------------------------
         */
        this._ambientlight = new THREE.AmbientLight();
        this._ambientlight.color.setHex(this.objects_props.ambientlight.color);
        this._ambientlight.intensity = this.objects_props.ambientlight.intensity;
        this._scene.add(this._ambientlight);

        /**
         * --------------------------------------------------------------------
         * Modify render to support lights
         * --------------------------------------------------------------------
         */
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.gammaInput = true;
        this._renderer.gammaOutput = true;

        /**
         * --------------------------------------------------------------------
         * Creates the camera
         * --------------------------------------------------------------------
         * @private
         */
        this._three_camera = new THREE.PerspectiveCamera(
            self.objects_props.camera.angle,
            self.objects_props.camera.aspect,
            self.objects_props.camera.near,
            self.objects_props.camera.far,
        );
        this._three_camera.zoom = this.objects_props.camera.zoom;
        this._cameralight = new THREE.PointLight();
        this._cameralight.color.setHex(this.objects_props.camera.light.color);
        this._cameralight.decay = this.objects_props.camera.light.decay;
        this._cameralight.distance = this.objects_props.camera.light.distance;
        this._cameralight.intensity = this.objects_props.camera.light.intensity;
        this._cameralight.castShadow = true;
        this._three_camera.add(this._cameralight);

        /**
         * --------------------------------------------------------------------
         * Add render to div
         * --------------------------------------------------------------------
         * @private
         */
        this.maindiv = $(self.id);
        this.maindiv.append(this._renderer.domElement);
        this._canvasParent.attr('tabindex', '1');

        /**
         * --------------------------------------------------------------------
         * Add camera to scene
         * --------------------------------------------------------------------
         */
        this._scene.add(this._three_camera);

        /**
         * --------------------------------------------------------------------
         * Create controls
         * --------------------------------------------------------------------
         */
        this._controls = new THREE.OrbitControls(this._three_camera, this._renderer.domElement);
        this._controls.addEventListener('change', this.render);
        this._controls.enablePan = false;
        this._controls.enableKey = false;
        this._controls.autoRotate = this.objects_props.camera.autorotate;
        this._controls.maxPolarAngle = this.objects_props.camera.maxpolarangle;
        this._controls.maxDistance = this.objects_props.camera.maxdistance;

        /**
         * --------------------------------------------------------------------
         * Set initial camera position
         * --------------------------------------------------------------------
         */
        this._setInitialCameraPosition();

        /**
         * --------------------------------------------------------------------
         * Creates raycaster
         * --------------------------------------------------------------------
         */
        this._raycaster = new THREE.Raycaster();

        /**
         * --------------------------------------------------------------------
         * Init GUI
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.gui) {
            this._threejs_helpers.gui = false;
            this.toggleGUI();
        }
        if (this._threejs_helpers.fpsmeter) {
            this.toggleFPSMeter();
        }

    };

    /**
     * Set camera position.
     *
     * @function
     * @private
     */
    this._setInitialCameraPosition = function () {

        // Initial position
        this._three_camera.position.x = this.objects_props.camera.posy;
        this._three_camera.position.y = this.objects_props.camera.posz;
        this._three_camera.position.z = this.objects_props.camera.posx;

        // Initial angle
        this._three_camera.rotation.x = this.objects_props.camera.rotationy;
        this._three_camera.rotation.y = this.objects_props.camera.rotationz;
        this._three_camera.rotation.z = this.objects_props.camera.rotationx;

        // Initial target
        this.objects_props.camera.target.x = self.objects_props.camera.initialTarget.x;
        this.objects_props.camera.target.y = self.objects_props.camera.initialTarget.y;
        this.objects_props.camera.target.z = self.objects_props.camera.initialTarget.z;

        // Updates camera
        this.setCameraTarget();

    };

    /**
     * Set camera target.
     *
     * @function
     */
    this.setCameraTarget = function () {
        // noinspection JSSuspiciousNameCombination
        self._controls.target.set(self.objects_props.camera.target.y, self.objects_props.camera.target.z, self.objects_props.camera.target.x);
        self._controls.update();
    };

    /**
     * Calculates distance between two points.
     *
     * @function
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    this.dist2 = function (a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };

    /**
     * Render Three.js content.
     *
     * @function
     */
    this.render = function () {

        // Render
        self._renderer.render(self._scene, self._three_camera);

        // Update helpers
        for (let i = 0; i < self._helpersUpdate.length; i += 1) {
            self._helpersUpdate[i].update();
        }
        if (notNullUndf(self._gui)) {
            self._guiCameraParams.posx = roundNumber(self._three_camera.position.z, 3);
            self._guiCameraParams.posy = roundNumber(self._three_camera.position.x, 3);
            self._guiCameraParams.posz = roundNumber(self._three_camera.position.y, 3);
            self._guiCameraParams.rotationx = roundNumber(self._three_camera.rotation.z, 3);
            self._guiCameraParams.rotationy = roundNumber(self._three_camera.rotation.x, 3);
            self._guiCameraParams.rotationz = roundNumber(self._three_camera.rotation.y, 3);
        }

    };

    /**
     * Update controls and render.
     *
     * @function
     */
    this.animateFrame = function () {

        // Update controls
        this._controls.update();

        // Render frame
        this.render();

    };

    /**
     * Animation thread {@link requestAnimationFrame}.
     *
     * @function
     * @private
     */
    this._animationThread = function () {
        if (!self._animateThread) return;
        requestAnimationFrame(self.initAnimate);
        self.animateFrame();
    };

    /**
     * Init render thread.
     *
     * @function
     * @protected
     */
    this.initAnimate = function () {
        self._animateThread = true;
        self._animationThread();
    };

    /**
     * Add objects to scene.
     *
     * @function
     * @private
     */
    this._initWorldObjects = function () {

        // Add helpers
        this._drawHelpers();

        // Set camera target
        this.setCameraTarget();

        // Save initial status
        this._saveInitialStatus();

    };

    /**
     * Save some variables before rendering.
     *
     * @function
     * @private
     */
    this._saveInitialStatus = function () {
        self.objects_props.camera.initialTarget.x = self.objects_props.camera.target.x;
        self.objects_props.camera.initialTarget.y = self.objects_props.camera.target.y;
        self.objects_props.camera.initialTarget.z = self.objects_props.camera.target.z;
    };

    /**
     * Force focus.
     *
     * @function
     * @private
     */
    this.focus = function () {
        self._canvasParent.trigger('focus');
    };

    /**
     * Change RGB to HEX color.
     *
     * @function
     * @private
     * @param {number} rgb
     * @returns {string}
     */
    this._rgb2hex = function (rgb) {
        let hex = rgb.toString(16);
        hex = hex.length === 1 ? "0" + hex : hex;
        return hex.toString();
    };

    /**
     * Init tooltip.
     *
     * @function
     * @protected
     */
    this._initTooltip = function () {

        /**
         * Enable tooltip
         */
        this.objects_props.tooltip.enabled = true;

        /**
         * If tooltip exists then it's removed
         */
        if (notNullUndf(this.objects_props.tooltip.obj)) {
            this.objects_props.tooltip.obj.remove();
        }

        /**
         * Create tooltip in main content
         * @type {string}
         */
        let $tooltipid = generateID();
        $('#' + this.objects_props.tooltip.container).append('<div id="{0}" class="{1}"></div>'.format($tooltipid, this.objects_props.tooltip.tooltipClass));
        if (this.objects_props.tooltip.tooltipClass === '') {
            app_console.warn(lang.viewer_tooltip_empty_class);
        }

        /**
         * Get object
         * @type {JQuery | jQuery | HTMLElement}
         */
        this.objects_props.tooltip.obj = $('#' + $tooltipid);

        /**
         * Configure tooltip
         */
        self.objects_props.tooltip.enabled = false;
        self.objects_props.tooltip.addMode(self.objects_props.tooltip.mode.group);

    };

    /**
     * Reset camera.
     *
     * @function
     */
    this.resetCamera = function () {
        self._setInitialCameraPosition();
        self.animateFrame();
    };

    /**
     * Enables/disables helpers.
     *
     * @function
     * @private
     */
    this._toggleHelper = function () {
        self._drawHelpers();
        self.animateFrame();
        self.focus();
    };

    /**
     * Hide/show axis.
     *
     * @function
     */
    this.toggleAxis = function () {
        self._threejs_helpers.axis = !self._threejs_helpers.axis;
        self._toggleHelper();
    };

    /**
     * Hide/show grid.
     *
     * @function
     */
    this.toggleGrid = function () {
        self._threejs_helpers.grid = !self._threejs_helpers.grid;
        self._toggleHelper();
    };

    /**
     * Hide/show world limits.
     *
     * @function
     */
    this.toggleWorldLimits = function () {
        self._threejs_helpers.worldlimits = !self._threejs_helpers.worldlimits;
        self._toggleHelper();
    };

    /**
     * Hide/show camera target.
     *
     * @function
     */
    this.toggleCameraTarget = function () {
        self._threejs_helpers.cameratarget = !self._threejs_helpers.cameratarget;
        self._toggleHelper();
    };

    /**
     * Hide/show planes.
     *
     * @function
     */
    this.togglePlanes = function () {
        self._threejs_helpers.planes = !self._threejs_helpers.planes;
        self._toggleHelper();
    };

    /**
     * Hide/show GUI.
     *
     * @function
     */
    this.toggleGUI = function () {
        self._threejs_helpers.gui = !self._threejs_helpers.gui;
        if (self._threejs_helpers.gui) {
            self._buildGUI();
        } else {
            self._destroyGUI();
        }
    };

    /**
     * Display renderer information.
     *
     * @function
     */
    this.showRendererInfo = function () {
        let $info = self._renderer.info;
        app_dialog.text('memory.<b>geometries</b>: {0}<br>memory.<b>textures</b>: {1}<br>render.<b>calls</b>: {2}<br>render.<b>frame</b>: {3}<br>render.<b>lines</b>: {4}<br>render.<b>points</b>: {5}<br>render.<b>triangles</b>: {6}'.format($info.memory.geometries.toLocaleString(), $info.memory.textures.toLocaleString(), $info.render.calls.toLocaleString(), $info.render.frame.toLocaleString(), $info.render.lines.toLocaleString(), $info.render.points.toLocaleString(), $info.render.triangles.toLocaleString()), lang.viewer_renderer_info);
    };

    /**
     * Return distance to origin.
     *
     * @function
     * @private
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    this._distOriginxyz = function (x, y, z) {
        // noinspection JSSuspiciousNameCombination
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    };

    /**
     * Build GUI.
     *
     * @function
     * @private
     */
    this._buildGUI = function () {

        /**
         * Creates the GUI
         */
        this._gui = new dat.GUI({autoPlace: false});

        /**
         * --------------------------------------------------------------------
         * Ambient light
         * --------------------------------------------------------------------
         */
        this._ambientLightParam = {
            color: self._ambientlight.color.getHex(),
            intensity: self._ambientlight.intensity,
            exportLight: function () {
                let $color = '0X' + self._rgb2hex(self._ambientLightParam.color).toUpperCase();
                app_dialog.text('<b>light.color</b>: <i>{0}</i>'.format($color), lang.viewer_gui_export_light_title);
                if (self._threejs_helpers.guicloseafterpopup) self._gui.close();
            },
        };
        let ambientlightfolder = this._gui.addFolder(lang.viewer_gui_ambientlight);
        ambientlightfolder.addColor(this._ambientLightParam, 'color').onChange(function (val) {
            self._ambientlight.color.setHex(val);
            self.render();
        });
        ambientlightfolder.add(this._ambientLightParam, 'intensity', 0, 5).onChange(function (val) {
            self._ambientlight.intensity = val;
            self.render();
        });
        ambientlightfolder.add(this._ambientLightParam, 'exportLight');

        /**
         * --------------------------------------------------------------------
         * Camera light folder
         * --------------------------------------------------------------------
         */
        this._cameraLightParam = {
            color: self._cameralight.color.getHex(),
            intensity: self._cameralight.intensity,
            distance: self._cameralight.distance,
            decay: self._cameralight.decay,
            exportLight: function () {

                // Calculate values
                let $distance, $color;
                $color = '0X' + self._rgb2hex(self._cameraLightParam.color).toUpperCase();
                $distance = roundNumber(self._cameralight.distance / self.worldsize.diagl, 3);

                // Popup
                app_dialog.text('<b>light.color</b>: <i>{0}</i><br><b>light.distance</b>: <i>{1}</i>'.format($color, $distance), lang.viewer_gui_export_light_title);
                if (self._threejs_helpers.guicloseafterpopup) self._gui.close();

            },
        };
        let cameralightfolder = this._gui.addFolder(lang.viewer_gui_cameralight);
        cameralightfolder.addColor(this._cameraLightParam, 'color').onChange(function (val) {
            self._cameralight.color.setHex(val);
            self.render();
        });
        cameralightfolder.add(this._cameraLightParam, 'intensity', 0, 5).onChange(function (val) {
            self._cameralight.intensity = val;
            self.render();
        });
        cameralightfolder.add(this._cameraLightParam, 'distance', 0, 3 * self.worldsize.diagl).onChange(function (val) {
            self._cameralight.distance = val;
            self.render();
        });
        cameralightfolder.add(this._cameraLightParam, 'decay', 1, 2).onChange(function (val) {
            self._cameralight.decay = val;
            self.render();
        });
        cameralightfolder.add(this._cameraLightParam, 'exportLight');

        /**
         * --------------------------------------------------------------------
         * Static light
         * --------------------------------------------------------------------
         */
        this._guiLightParam = {
            color: self._light.color.getHex(),
            intensity: self._light.intensity,
            distance: self._light.distance,
            angle: self._light.angle,
            penumbra: self._light.penumbra,
            decay: self._light.decay,
            posx: self._light.position.z,
            posy: self._light.position.x,
            posz: self._light.position.y,
            planeshadow: self.objects_props.light.planeshadow,
            radius: self._distOriginxyz(self._light.position.x, self._light.position.y, self._light.position.z),
            rotatexy: (Math.atan2(this._light.position.z, this._light.position.x) * 180 / Math.PI + 360) % 360,
            rotatexz: 0.0,
            rotateyz: 0.0,
            mapsizeh: self._light.shadow.mapSize.height,
            mapsizew: self._light.shadow.mapSize.width,
            exportLight: function () {

                // Calculate values
                let $posx, $posy, $posz, $distance, $color;
                $posx = roundNumber(self._light.position.z / self.worldsize.x, 3);
                $posy = roundNumber(self._light.position.x / self.worldsize.y, 3);
                $posz = roundNumber(self._light.position.y / self.worldsize.z, 3);
                $distance = roundNumber(self._light.distance / self.worldsize.diagl, 3);
                $color = '0X' + self._rgb2hex(self._guiLightParam.color).toUpperCase();

                // Popup
                app_dialog.text('<b>light.color</b>: <i>{4}</i><br><b>light.pos.x</b>: <i>{0}</i><br><b>light.pos.y</b>: <i>{1}</i><br><b>light.pos.z</b>: <i>{2}</i><br><b>light.distance</b>: <i>{3}</i>'.format($posx, $posy, $posz, $distance, $color), lang.viewer_gui_export_light_title);
                if (self._threejs_helpers.guicloseafterpopup) self._gui.close();

            },
        };
        let lightfolder = this._gui.addFolder(lang.viewer_gui_light);
        lightfolder.addColor(this._guiLightParam, 'color').onChange(function (val) {
            self._light.color.setHex(val);
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'intensity', 0, 10).onChange(function (val) {
            self._light.intensity = val;
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'distance', 0.01, 3 * self.worldsize.diagl).onChange(function (val) {
            self._light.distance = val;
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'angle', 0.01, Math.PI / 2).onChange(function (val) {
            self._light.angle = val;
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'penumbra', 0, 1).onChange(function (val) {
            self._light.penumbra = val;
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'decay', 1, 2).onChange(function (val) {
            self._light.decay = val;
            self.render();
        });
        lightfolder.add(this._guiLightParam, 'posx', -self.worldsize.diagl, self.worldsize.diagl).onChange(function (val) {
            self._light.position.z = val;
            self.render();
            // noinspection JSSuspiciousNameCombination
            self._guiLightParam.rotatexy = (180 * Math.atan2(self._light.position.x, self._light.position.z) / Math.PI + 360) % 360;
        }).listen();
        lightfolder.add(this._guiLightParam, 'posy', -self.worldsize.diagl, self.worldsize.diagl).onChange(function (val) {
            self._light.position.x = val;
            self.render();
        }).listen();
        lightfolder.add(this._guiLightParam, 'posz', 0, self.worldsize.diagl).onChange(function (val) {
            self._light.position.y = val;
            self.render();
        }).listen();
        lightfolder.add(this._guiLightParam, 'radius', 0.01, self.worldsize.diagl).onChange(function (r) {

            // Radius
            let $ract = self._distOriginxyz(self._light.position.x, self._light.position.y, self._light.position.z);

            // Calculate angles
            let angxy, angxyz;
            // noinspection JSSuspiciousNameCombination
            angxy = Math.atan2(self._light.position.x, self._light.position.z);
            angxyz = Math.asin(self._light.position.y / $ract);

            // Calculates projection between radius and xz plane
            let $e = r * Math.cos(angxyz);

            // Calculate new position
            let $x, $y, $z;
            $x = $e * Math.cos(angxy);
            $y = $e * Math.sin(angxy);
            $z = $e * Math.tan(angxyz);

            // noinspection JSSuspiciousNameCombination
            self._light.position.x = $y;
            self._light.position.y = $z;
            self._light.position.z = $x;
            self.render();

            // Updates menu entry
            self._guiLightParam.posx = self._light.position.x;
            self._guiLightParam.posy = self._light.position.z;
            self._guiLightParam.posz = self._light.position.y;

        }).listen();
        lightfolder.add(this._guiLightParam, 'rotatexy', 0, 360).onChange(function (val) {

            // Calculates angle in radians
            val = val * Math.PI / 180;

            // Actual position
            let posx, posy;
            posx = self._light.position.x;
            posy = self._light.position.z;

            // noinspection JSSuspiciousNameCombination
            let r = Math.sqrt(Math.pow(posx, 2) + Math.pow(posy, 2)); // Radius

            // Update position
            self._light.position.z = r * Math.cos(val);
            self._light.position.x = r * Math.sin(val);
            self.render();

            // Update menu entry
            self._guiLightParam.posx = self._light.position.z;
            self._guiLightParam.posy = self._light.position.x;

        }).listen();
        lightfolder.add(this._guiLightParam, 'exportLight');

        /**
         * --------------------------------------------------------------------
         * Fog folder
         * --------------------------------------------------------------------
         */
        let fogfolder = this._gui.addFolder(lang.viewer_gui_fog);
        this._guiFogParams = {
            color: self._fog.color.getHex(),
            density: self._fog.density,
            enabled: self.objects_props.fog.enabled,
        };
        fogfolder.addColor(this._guiFogParams, 'color').onChange(function (val) {
            self._fog.color.setHex(val);
            self.render();
        });
        fogfolder.add(this._guiFogParams, 'density', 0.00001, 0.00025 * 10).onChange(function (val) {
            self._fog.density = val;
            self.render();
        });
        fogfolder.add(this._guiFogParams, 'enabled').onChange(function (val) {
            if (val) {
                self._scene.fog = self._fog;
            } else {
                self._scene.fog = null;
            }
            self.animateFrame();
        });

        /**
         * --------------------------------------------------------------------
         * Camera folder
         * --------------------------------------------------------------------
         */
        let camerafolder = this._gui.addFolder(lang.viewer_gui_camera);
        this._guiCameraParams = {
            fov: self._three_camera.fov,
            far: self._three_camera.far,
            zoom: self._three_camera.zoom,
            maxdistance: self._controls.maxDistance,
            maxpolarangle: self._controls.maxPolarAngle,
            posx: self._three_camera.position.z,
            posy: self._three_camera.position.x,
            posz: self._three_camera.position.y,
            rotationx: Number(self._three_camera.rotation.z) + 0.01,
            rotationy: Number(self._three_camera.rotation.x) + 0.01,
            rotationz: Number(self._three_camera.rotation.y) + 0.01
        };
        camerafolder.add(this._guiCameraParams, 'fov', 1, 179).onChange(function (val) {
            self._three_camera.fov = val;
            self._three_camera.updateProjectionMatrix();
            self.animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'far', 100, 10000).onChange(function (val) {
            self._three_camera.far = val;
            self._three_camera.updateProjectionMatrix();
            self.animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'zoom', 0.1, 10).onChange(function (val) {
            self._three_camera.zoom = val;
            self._three_camera.updateProjectionMatrix();
            self.animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'maxdistance', 100, 5 * self.worldsize.diagl).onChange(function (val) {
            self._controls.maxDistance = val;
            self.animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'maxpolarangle', 0, Math.PI).onChange(function (val) {
            self._controls.maxPolarAngle = val;
            self.animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'posx', 1, 2 * self.worldsize.diagl).onChange(function (val) {
            self._three_camera.position.z = val;
            self.animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'posy', 1, 2 * self.worldsize.diagl).onChange(function (val) {
            self._three_camera.position.x = val;
            self.animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'posz', 1, 2 * self.worldsize.diagl).onChange(function (val) {
            self._three_camera.position.y = val;
            self.animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationx', -Math.PI, Math.PI).onChange(function (val) {
            self._three_camera.rotation.z = val;
            self.animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationy', -Math.PI, Math.PI).onChange(function (val) {
            self._three_camera.rotation.x = val;
            self.animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationz', -Math.PI / 2, Math.PI / 2).onChange(function (val) {
            self._three_camera.rotation.y = val;
            self.animateFrame();
        }).listen();

        /**
         * Adds GUI to DIV
         */
        $('#' + this._guiID).append(this._gui.domElement);

        /**
         * GUI starts closed
         */
        if (this._threejs_helpers.guistartclosed) {
            this._gui.close();
        }

    };

    /**
     * Destroy GUI.
     *
     * @function
     * @private
     */
    this._destroyGUI = function () {
        if (notNullUndf(self._gui)) {
            self._gui.destroy();
            self._gui = null;
            $('#' + self._guiID).empty();
        }
    };

    /**
     * Adds FPS meter.
     *
     * @function
     */
    this.toggleFPSMeter = function () {

        // If not enabled
        if (!self._threejs_helpers.fpsmeter) return;

        // If not created
        if (isNullUndf(self._helperInstances.fpsmeter)) {
            let stats = new Stats();
            self._canvasParent.append(stats.dom);
            requestAnimationFrame(function loop() {
                stats.update();
                requestAnimationFrame(loop);
            });
            self._helperInstances.fpsmeter = stats;
        }

        // If created then closes
        else {
            self._helperInstances.fpsmeter.dom.remove();
            self._helperInstances.fpsmeter = null;
        }

    };

    /**
     * Draw helpers.
     *
     * @function
     * @private
     */
    this._drawHelpers = function () {

        // Local variable
        let helper;

        /**
         * --------------------------------------------------------------------
         * Draw axis
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.axis) {
            if (isNullUndf(this._helperInstances.axis)) {
                let $helpersize = Math.min(self.worldsize.x, self.worldsize.y, self.worldsize.z) * self._threejs_helpers.axissize;
                helper = new THREE.AxesHelper($helpersize);
                self._addMeshToScene(helper, this._globals.helper, false);
                // noinspection JSValidateTypes
                this._helperInstances.axis = helper;
            }
        } else { // Deletes helper if initialized
            if (notNullUndf(this._helperInstances.axis)) {
                self._scene.remove(this._helperInstances.axis);
            }
            this._helperInstances.axis = null;
        }


        /**
         * --------------------------------------------------------------------
         * Draw X, Y and Z planes
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.planes) {
            if (isNullUndf(this._helperInstances.planes)) {
                let $planes = [];

                // Colors
                let materialx = new THREE.MeshBasicMaterial({
                    color: self._threejs_helpers.planecolorx,
                    opacity: self._threejs_helpers.planeopacity,
                });
                let materialy = new THREE.MeshBasicMaterial({
                    color: self._threejs_helpers.planecolory,
                    opacity: self._threejs_helpers.planeopacity,
                });
                let materialz = new THREE.MeshBasicMaterial({
                    color: self._threejs_helpers.planecolorz,
                    opacity: self._threejs_helpers.planeopacity,
                });
                materialx.wireframe = true;
                materialx.aoMapIntensity = self._threejs_helpers.planeopacity;
                materialy.wireframe = true;
                materialy.aoMapIntensity = self._threejs_helpers.planeopacity;
                materialz.wireframe = true;
                materialz.aoMapIntensity = self._threejs_helpers.planeopacity;

                // Geometry
                let geometry, plane;

                // X plane
                geometry = new THREE.Geometry();
                geometry.vertices.push(
                    this._newThreePoint(this.worldsize.x, 0, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, 0, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, 0, this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, 0, this.worldsize.z)
                );
                geometry.faces.push(new THREE.Face3(0, 1, 2));
                geometry.faces.push(new THREE.Face3(0, 2, 3));
                plane = new THREE.Mesh(geometry, materialx);
                plane.position.y = 0;
                self._addMeshToScene(plane, this._globals.helper, false);
                $planes.push(plane);

                // Y plane
                geometry = new THREE.Geometry();
                geometry.vertices.push(
                    this._newThreePoint(0, -this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(0, this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(0, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(0, -this.worldsize.y, this.worldsize.z)
                );
                geometry.faces.push(new THREE.Face3(0, 1, 2));
                geometry.faces.push(new THREE.Face3(0, 2, 3));
                plane = new THREE.Mesh(geometry, materialy);
                plane.position.y = 0;
                self._addMeshToScene(plane, this._globals.helper, false);
                $planes.push(plane);

                // Z plane
                geometry = new THREE.Geometry();
                geometry.vertices.push(
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, 0),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, 0),
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, 0),
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, 0)
                );
                geometry.faces.push(new THREE.Face3(0, 1, 2));
                geometry.faces.push(new THREE.Face3(0, 2, 3));
                plane = new THREE.Mesh(geometry, materialz);
                plane.position.y = 0;
                self._addMeshToScene(plane, this._globals.helper, false);
                $planes.push(plane);

                // noinspection JSValidateTypes
                this._helperInstances.planes = $planes;
            }
        } else { // Deletes helper if initialized
            if (notNullUndf(this._helperInstances.planes)) {
                let $planes = this._helperInstances.planes;
                for (let i = 0; i < $planes.length; i += 1) {
                    this._scene.remove($planes[i]);
                }
            }
            this._helperInstances.planes = null;
        }

        /**
         * --------------------------------------------------------------------
         * Draw plane grid
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.grid) {
            if (isNullUndf(this._helperInstances.grid)) {
                let $mapsize = 2 * Math.max(this.worldsize.x, this.worldsize.y);
                let $griddist = Math.floor(2 / this._threejs_helpers.griddist);
                helper = new THREE.GridHelper($mapsize, $griddist);
                helper.position.y = 0;
                helper.material.opacity = 0.5;
                helper.material.transparent = true;
                self._addMeshToScene(helper, this._globals.helper, false);
                // noinspection JSValidateTypes
                this._helperInstances.grid = helper;
            }
        } else { // Deletes helper if initialized
            if (notNullUndf(this._helperInstances.grid)) {
                this._scene.remove(this._helperInstances.grid);
            }
            this._helperInstances.grid = null;
        }

        /**
         * --------------------------------------------------------------------
         * Draw map limits
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.worldlimits) {
            if (isNullUndf(this._helperInstances.worldlimits)) {
                let material = new THREE.MeshBasicMaterial({
                    color: self._threejs_helpers.worldlimitscolor,
                    opacity: self._threejs_helpers.planeopacity
                });
                material.wireframe = true;
                material.aoMapIntensity = 0.5;
                let geometry = new THREE.Geometry();
                geometry.vertices.push(
                    // +X
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, this.worldsize.z),

                    // +Y
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, this.worldsize.z),

                    // -X
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, this.worldsize.z),

                    // -Y
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, -this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, this.worldsize.z),

                    // Z
                    this._newThreePoint(this.worldsize.x, -this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(this.worldsize.x, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, this.worldsize.y, this.worldsize.z),
                    this._newThreePoint(-this.worldsize.x, -this.worldsize.y, this.worldsize.z)
                );
                for (let j = 0; j <= 4; j += 1) {
                    geometry.faces.push(new THREE.Face3(4 * j, 4 * j + 1, 4 * j + 2));
                    geometry.faces.push(new THREE.Face3(4 * j, 4 * j + 2, 4 * j + 3));
                }
                let cube = new THREE.Mesh(geometry, material);
                cube.position.y = 0;
                self._addMeshToScene(cube, this._globals.helper, false);
                // noinspection JSValidateTypes
                this._helperInstances.worldlimits = cube;
            }
        } else { // Deletes helper if initialized
            if (notNullUndf(this._helperInstances.worldlimits)) {
                this._scene.remove(this._helperInstances.worldlimits);
            }
            this._helperInstances.worldlimits = null;
        }

        /**
         * --------------------------------------------------------------------
         * Draw camera objective
         * --------------------------------------------------------------------
         */
        if (this._threejs_helpers.cameratarget) {
            if (isNullUndf(this._helperInstances.cameratarget)) {
                let $targetsize = Math.min(self.worldsize.x, self.worldsize.y, self.worldsize.z) * self._threejs_helpers.cameratargetsize / 2;
                let sphereGeometry = new THREE.SphereGeometry($targetsize, 16, 8);
                let wireframeMaterial = new THREE.MeshBasicMaterial(
                    {
                        color: self._threejs_helpers.cameratargetcolor,
                        transparent: true,
                        wireframe: true,
                    });
                let mesh = new THREE.Mesh(sphereGeometry, wireframeMaterial);
                let $update = function () {
                    // noinspection JSSuspiciousNameCombination
                    mesh.position.x = self.objects_props.camera.target.y;
                    mesh.position.y = self.objects_props.camera.target.z;
                    mesh.position.z = self.objects_props.camera.target.x;
                };
                $update();
                self._addMeshToScene(mesh, this._globals.helper, false);
                this._helpersUpdate.push({
                    update: $update,
                });

                // noinspection JSValidateTypes
                this._helperInstances.cameratarget = {
                    obj: mesh,
                    update: this._helpersUpdate.length - 1,
                };
            }
        } else { // Deletes helper if initialized
            if (notNullUndf(this._helperInstances.cameratarget)) {
                this._helpersUpdate.splice(this._helperInstances.cameratarget.update, 1);
                this._scene.remove(this._helperInstances.cameratarget.obj);
            }
            this._helperInstances.cameratarget = null;
        }

    };

    /**
     * Add a point in (x,y,z).
     *
     * @function
     * @private
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    this._newThreePoint = function (x, y, z) {
        return new THREE.Vector3(y, z, x);
    };

    /**
     * Draw volume.
     *
     * @function
     * @param {Volume} volume
     * @private
     */
    this._draw_volume = function (volume) {

        // Store volume
        self._volume = volume;

        // Destroy geometry if added
        if (notNullUndf(this._viewerMesh)) this._scene.remove(this._viewerMesh);

        // Scale volume
        volume.scale(1, this.worldsize.x, this.worldsize.y, this.worldsize.z);

        // Create new geometry
        let geometryMerge = new THREE.Geometry();
        let mergeMaterials = [];
        let meshNames = [];

        // Draw each face
        let faces = volume.get_faces();
        for (let i = 0; i < faces.length; i += 1) {
            this._draw_face(faces[i], geometryMerge, mergeMaterials);
            meshNames.push(i);
        }

        // Create figure
        self._viewerMesh = new THREE.Mesh(geometryMerge, mergeMaterials);
        this._addMeshToScene(this._viewerMesh, this._globals.volume, true);
        this.objects_props.tooltip.mode.group.addContainer(this._globals.volume, meshNames);

        // Adds normal helper
        if (this._threejs_helpers.normals) {
            let nh_size = Math.min(this.worldsize.x, this.worldsize.x, this.worldsize.z) * 0.1;
            let helper = new THREE.FaceNormalsHelper(this._viewerMesh, nh_size,
                this._threejs_helpers.normalcolor, 1);
            this._addMeshToScene(helper, this._globals.normals, false);
        }

        // Create secondary contour
        let s_edges = new THREE.EdgesGeometry(geometryMerge);
        let s_material = new THREE.LineBasicMaterial({color: this.palette.contour_major_color});
        s_material.opacity = this.palette.contour_major_opacity;
        let s_contour = new THREE.LineSegments(s_edges, s_material);
        this._addMeshToScene(s_contour, this._globals.contour, false);

        // Render
        this.render();

    };

    /**
     * Create contours from a geometry.
     *
     * @function
     * @protected
     * @param {EdgesGeometry} edges - Geometry edges
     * @param {number} color - Border color
     * @returns {LineSegments}
     */
    this._createContour = function (edges, color) {
        let material = new THREE.LineBasicMaterial({color: color});
        return new THREE.LineSegments(edges, material);
    };

    /**
     * Draw face.
     *
     * @function
     * @param {Face} face - Face to draw
     * @param {Object} geometry - Three.js geometry buffer
     * @param {MeshPhongMaterial[]} material - Material
     * @private
     */
    this._draw_face = function (face, geometry, material) {

        // Create geometry
        let geom = face.generate_geometry();

        // Create material
        let mat = new THREE.MeshPhongMaterial({
            bumpScale: 0.25,
            color: self.palette.face_color_unplayed,
            emissive: self.palette.face_unhover_unplayed,
            shininess: self.palette.face_shininess_unplayed,
            specular: self.palette.face_specular,
        });
        if (!face.is_enabled()) {
            mat.color = self.palette.face_color_played;
            mat.emissive = self.palette.face_unhover_played;
            mat.shininess = self.palette.face_shininess_played;
        }

        // Create mesh
        let $mesh = new THREE.Mesh(geom, mat);

        // Update mesh with material
        $mesh.updateMatrix();
        let $meshfaces = $mesh.geometry.faces;
        for (let i = 0; i < $meshfaces.length; i += 1) { // Update each face index
            $mesh.geometry.faces[i].materialIndex = 0;
        }
        $mesh.updateMatrix();

        // Merge geometry
        geometry.merge($mesh.geometry, $mesh.matrix, material.length);
        material.push(mat);
        face.set_mesh($mesh);
        face.place_image(this);

        // Create contour
        if (face.is_enabled()) {
            let objEdges = new THREE.EdgesGeometry(geom);
            let contour = this._createContour(objEdges, this.palette.contour_minor_color);
            contour.material.opacity = this.palette.contour_minor_opacity;
            contour.position.y = 0;
            contour.material.transparent = false;
            this._addMeshToScene(contour, this._globals.contour, false);
        }

    };

    /**
     * Adds mesh to scene.
     *
     * @function
     * @protected
     * @param {Object3D} mesh - Mesh
     * @param {string} name - Object name
     * @param {boolean=} collaidable - Object is collaidable or not
     * @param {boolean=} castShadow - Object cast shadows
     * @param {boolean=} receiveShadow - Object can receive shadows
     */
    this._addMeshToScene = function (mesh, name, collaidable, castShadow, receiveShadow) {

        // Apply properties
        mesh.name = name;
        if (isNullUndf(castShadow)) castShadow = false;
        if (isNullUndf(receiveShadow)) receiveShadow = false;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        // Add mesh to scene
        self._scene.add(mesh);

        // Add to collaidable
        if (collaidable) self._addToCollidable(mesh);

    };

    /**
     * Adds mesh to collaidable list.
     *
     * @function
     * @protected
     * @param {object} mesh
     */
    this._addToCollidable = function (mesh) {
        this._collaidableMeshes.push(mesh);
    };

    /**
     * Return canvas parent.
     *
     * @function
     * @returns {JQuery|jQuery|HTMLElement}
     */
    this.get_canvas_parent = function () {
        return this._canvasParent;
    };

    /**
     * Returns camera.
     *
     * @function
     * @returns {THREE.PerspectiveCamera|PerspectiveCamera}
     */
    this.get_camera = function () {
        return this._three_camera;
    };

    /**
     * Returns scene.
     *
     * @function
     * @returns {THREE.Scene|Scene}
     */
    this.get_scene = function () {
        return this._scene;
    };

    /**
     * Returns raycaster.
     *
     * @function
     * @returns {THREE.Raycaster|Raycaster}
     */
    this.get_raycaster = function () {
        return this._raycaster;
    };


    /**
     * ------------------------------------------------------------------------
     * Viewer functions
     * ------------------------------------------------------------------------
     */

    /**
     * Init viewer.
     *
     * @function
     * @public
     * @param {string} parentElement - Container
     */
    this.init = function (parentElement) {
        self.id = parentElement;
        self._canvasParent = $(parentElement);
        self._initThree();
        self._initWorldObjects();
        self._initTooltip();
        self.focus();
        self.animateFrame();
    };

    /**
     * Creates new game.
     *
     * @function
     * @param {Volume} volume
     */
    this.new = function (volume) {
        this._draw_volume(volume);
        loadingHandler(false);
    };

}