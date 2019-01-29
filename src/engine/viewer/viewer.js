/**
 VIEWER
 Implements Threejs viewer.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Main viewer class
 *
 * @class
 * @constructor
 */
function TMSViewer() {
    /* eslint-disable arrow-parens */
    /* eslint-disable newline-per-chained-call */
    /* eslint-disable no-mixed-operators */

    /**
     * ------------------------------------------------------------------------
     * Viewer variables
     * ------------------------------------------------------------------------
     */

    /**
     * Canvas ID
     * @type {string}
     * @private
     */
    this.id = generateID();

    /**
     * DIV canvas
     * @type {JQuery | jQuery | HTMLElement | null}
     * @protected
     */
    this._canvasParent = null;

    /**
     * Object pointer
     * @type {TMSViewer}
     */
    let self = this;

    // noinspection JSUnusedGlobalSymbols
    /**
     * GUI ID
     * @type {object | string}
     * @protected
     */
    this._guiID = 'viewer-gui';

    /**
     * Viewer mesh
     * @type {Mesh | null}
     * @private
     */
    this._viewerMesh = null;


    /**
     * ------------------------------------------------------------------------
     * Events
     * ------------------------------------------------------------------------
     */

    // noinspection JSUnusedGlobalSymbols
    /**
     * Button is pressed
     * @type {boolean}
     * @private
     */
    this._hasKeyPressed = false;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mouse over canvas
     * @type {boolean}
     * @private
     */
    this._hasMouseOver = false;

    /**
     * Mouse is pressed
     * @type {boolean}
     * @private
     */
    this._hasMousePressed = false;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mouse is pressed and dragged
     * @type {boolean}
     * @private
     */
    this._mouseMoveDrag = false;

    // noinspection JSUnusedGlobalSymbols
    /**
     * 5r
     * @type {boolean}
     * @private
     */
    this._hasMouseIntersectPlane = false;

    /**
     * Window mousemove ID event
     * @type {string}
     * @private
     */
    this._windowMouseMoveEvent = 'mousemove.rectzoom';

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mouse is pressed
     * @type {boolean}
     * @private
     */
    this._mouseKeepPressed = false;

    /**
     * Event IDs
     * @private
     */
    this._eventID = {
        click: 'click.canvas',
        contextmenu: 'contextmenu.canvas',
        keydown: 'keydown.canvas',
        keyup: 'keyup.canvas',
        mousedown: 'mousedown.canvas',
        mouseout: 'mouseout.canvas',
        mouseover: 'mouseover.canvas',
        mouseup: 'mouseup.canvas',
        mousewheel: 'mousewheel.canvas',
        wheel: 'wheel.canvas',
    };


    /**
     * ------------------------------------------------------------------------
     * Three.js objects
     * ------------------------------------------------------------------------
     */

    /**
     * Animation is active
     * @type {boolean}
     * @private
     */
    this._animateThread = false;

    /**
     * Three.js helpers
     * @protected
     */
    this.threejs_helpers = {

        /**
         * Status
         */
        axis: false,                     // Show axis
        cameratarget: false,             // Show camera target
        fpsmeter: true,                  // Show fps
        grid: true,                      // Show grid plane
        gui: false,                      // Show GUI
        planes: false,                   // Show planes
        worldlimits: false,              // Show world limits

        /**
         * Helpers parameters
         */
        axissize: 0.40,                 // Axis sizes
        cameratargetcolor: 0X0000FF,    // Color target
        cameratargetsize: 0.02,         // Size target
        griddist: 0.03,                 // Grid distance in percentage
        guistartclosed: true,           // GUI starts closed
        guicloseafterpopup: false,      // GUI closes after an popup
        planecolorx: 0X0000FF,          // X plane color
        planecolory: 0XFF0000,          // Y plane color
        planecolorz: 0X00FF00,          // Z plane color
        planeopacity: 0.5,              // Plane opacity
        worldlimitscolor: 0X444444,     // World limits color

    };

    /**
     * Contains helpers updates
     * @type {Array}
     * @private
     */
    this._helpersUpdate = [];

    /**
     * Helpers instances @drawHelpers
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
     * Global names
     * @protected
     */
    this._globals = {
        contour: '__CONTOUR',
        helper: '__HELPER',
        plane: '__PLANE',
    };

    /**
     * Object properties
     * @protected
     */
    this.objects_props = {

        /**
         * Scane plane
         */
        plane: {
            color: 0x222222,                 // Color
            dithering: false,                // Dithering
            obj: null,                       // Stores the object
        },

        /**
         * Cámara
         */
        camera: {
            angle: 56,                       // FOV
            autorotate: false,               // Auto rotates the camera
            far: 9.000,                      // Far plane
            light: {                         // Light color on the camera
                color: 0X181818,
                decay: 1.500,
                distance: 0.483,
                intensity: 0.600,
            },
            maxdistance: 2.500,              // Maximum distance
            maxpolarangle: Math.PI,          // Max polar angle
            near: 0.001,                     // Close plane
            nopan: true,                     // Mouse pan
            posx: 0.800,                     // Initial X position
            posy: -0.600,                    // Initial Y position
            posz: 1.500,                     // Initial Z position
            rotationx: -1.000,               // Initial X rotation
            rotationy: -1.300,               // Initial Y rotation
            rotationz: -0.500,               // Initial Z rotation
            target: {                        // Camera target
                x: 0.000,
                y: 0.000,
                z: 0.000,
            },
            targetMoveCamera: true,          // Move camera target
            targetMoveCameraFlipByPos: true, // Inverse camera target
            targetSpeed: {                   // Target speed
                angular: 0.05,
                x: 0.010,
                y: 0.010,
                z: 0.050,
            },
            zoom: 1.000,                     // Zoom factor
        },

    };

    /**
     * World limits
     */
    this._worldsize = {
        x: 1.000,
        y: 1.000,
        z: 1.000,
    };

    /**
     * Collaidable meshes list
     * @type {Array}
     * @private
     */
    this._collaidableMeshes = [];

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mouse coordinates
     * @private
     */
    this._mouse = {
        x: 0,
        y: 0
    };


    /**
     * ------------------------------------------------------------------------
     * Viewer methods, general functions
     * ------------------------------------------------------------------------
     */

    /**
     * Resize canvas
     *
     * @function
     * @protected
     * @param {boolean} type - If true add event, false deletes
     */
    this._threeResize = function (type) {

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
                self._animateFrame();

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
        this._worldsize.diagl = Math.sqrt(Math.pow(2 * this._worldsize.x, 2) +
            Math.pow(2 * this._worldsize.y, 2) + Math.pow(this._worldsize.z, 2));
        this._worldsize.diagx = Math.sqrt(Math.pow(2 * this._worldsize.x, 2) +
            Math.pow(this._worldsize.z, 2));
        this._worldsize.diagy = Math.sqrt(Math.pow(2 * this._worldsize.y, 2) +
            Math.pow(this._worldsize.z, 2));

        /**
         * --------------------------------------------------------------------
         * Set camera
         * --------------------------------------------------------------------
         */

        // Camera restrictions
        this.objects_props.camera.far *= this._worldsize.diagl;
        this.objects_props.camera.maxdistance *= this._worldsize.diagl;
        this.objects_props.camera.maxpolarangle *= Math.PI / 2;

        // Initial position
        this.objects_props.camera.posx *= this._worldsize.x;
        this.objects_props.camera.posy *= this._worldsize.y;
        this.objects_props.camera.posz *= this._worldsize.z;

        // Initial rotation
        this.objects_props.camera.rotationx *= Math.PI / 2;
        this.objects_props.camera.rotationy *= Math.PI / 2;
        this.objects_props.camera.rotationz *= Math.PI / 2;

        // Camera target
        this.objects_props.camera.target.x *= this._worldsize.x;
        this.objects_props.camera.target.y *= this._worldsize.y;
        this.objects_props.camera.target.z *= this._worldsize.z;

        // Target speed
        this.objects_props.camera.targetSpeed.x *= this._worldsize.x;
        this.objects_props.camera.targetSpeed.y *= this._worldsize.y;
        this.objects_props.camera.targetSpeed.z *= this._worldsize.z;
        this.objects_props.camera.targetSpeed.xy = this._dist2(this.objects_props.camera.targetSpeed.x, this.objects_props.camera.targetSpeed.y);

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
        this.objects_props.camera.light.distance *= this._worldsize.diagl;

        /**
         * --------------------------------------------------------------------
         * Inicia Three.js render
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

            // WebGL power preference "high-performance", "low-power" ó "default"
            powerPreference: "high-performance",

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

        // noinspection JSUnusedGlobalSymbols
        this._cameralight = new THREE.PointLight();
        this._cameralight.color.setHex(this.objects_props.camera.light.color);
        this._cameralight.decay = this.objects_props.camera.light.decay;
        this._cameralight.distance = this.objects_props.camera.light.distance;
        this._cameralight.intensity = this.objects_props.camera.light.intensity;
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
        this._controls.addEventListener('change', this._render);
        this._controls.enablePan = true;
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

        // noinspection JSUnusedGlobalSymbols
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
        if (this.threejs_helpers.gui) {
            this.threejs_helpers.gui = false;
            this._toggleGUI();
        }
        if (this.threejs_helpers.fpsmeter) {
            this._toggleFPSMeter();
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
        this._setCameraTarget();

    };

    /**
     * Set camera target.
     *
     * @function
     * @private
     */
    this._setCameraTarget = function () {
        // noinspection JSSuspiciousNameCombination
        self._controls.target.set(self.objects_props.camera.target.y, self.objects_props.camera.target.z, self.objects_props.camera.target.x);
        self._controls.update();
    };

    /**
     * Check that the camera target is inside the world limits.
     *
     * @function
     * @private
     * @param {string} axis - Updated axis
     * @param {number} min - Min position value
     * @param {number} max - Max position value
     * @returns {boolean} - Camera can move
     */
    this._checkCameraTargetLimits = function (axis, min, max) {
        let $pos = self.objects_props.camera.target[axis];
        if (min <= $pos && $pos <= max) {
            return true;
        }
        self.objects_props.camera.target[axis] = Math.min(max, Math.max($pos, min));
        return false;
    };

    /**
     * Calculates distance between two points.
     *
     * @function
     * @private
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    this._dist2 = function (a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };

    /**
     * Check camera target cannot collide.
     *
     * @function
     * @private
     * @param {string} axis - Axis to evaluate
     * @param {number} val - Value to add
     * @returns {boolean} - Collides or not
     */
    this._checkCameraTargetCollision = function (axis, val) {
        self.objects_props.camera.target[axis] += val;
        return true;
    };

    /**
     * Increase camera target.
     *
     * @function
     * @private
     * @param {string} dir - Direction
     * @param {number} val - Increase target
     * @param {boolean=} flipSignPos - Change increase direction
     * @param {boolean=} setTarget - Set camera target
     */
    this._updateCameraTarget = function (dir, val, flipSignPos, setTarget) {

        let $factor = 1.0;
        switch (dir) {
            case 'x':
                if (flipSignPos) { // Updates factor depending the position of the camera
                    $factor = Math.sign(self._three_camera.position.z);
                }
                val *= $factor;

                // Updates target and camera
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, -self._worldsize.x, self._worldsize.x) && self.objects_props.camera.targetMoveCamera) {
                    self._three_camera.position.z += val;
                }
                break;
            case 'y':
                if (flipSignPos) { // Updates factor depending the position of the camera
                    $factor = Math.sign(self._three_camera.position.x);
                }
                val *= $factor;

                // Updates target and camera
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, -self._worldsize.y, self._worldsize.y) && self.objects_props.camera.targetMoveCamera) {
                    self._three_camera.position.x += val;
                }
                break;
            case 'z':
                if (flipSignPos) { // Updates factor depending the position of the camera
                    // noinspection JSSuspiciousNameCombination
                    $factor = Math.sign(self._three_camera.position.y);
                }
                val *= $factor;

                // Updates target and camera
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, 0.00001, self._worldsize.z) && self.objects_props.camera.targetMoveCamera) {
                    self._three_camera.position.y += val;
                }
                break;
            default:
                break;
        }
        if (setTarget) self._setCameraTarget();

    };

    /**
     * Render Three.js content.
     *
     * @function
     * @private
     */
    this._render = function () {

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
     * @private
     */
    this._animateFrame = function () {

        // Update controls
        this._controls.update();

        // Render frame
        this._render();

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
        self._animateFrame();
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
        this._setCameraTarget();

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
     * Moves camera parallel to the ray between camera and target.
     *
     * @function
     * @private
     * @param {number} direction
     */
    this._moveParallel = function (direction) {

        // Calculates advance angle
        let $ang = Math.atan2(self._three_camera.position.x - self.objects_props.camera.target.y, self._three_camera.position.z - self.objects_props.camera.target.x);

        // Calculate displacements
        let $dx, $dy;
        $dx = self.objects_props.camera.targetSpeed.x * Math.cos($ang) * direction;
        $dy = self.objects_props.camera.targetSpeed.y * Math.sin($ang) * direction;

        // Adds to components
        self._updateCameraTarget('x', $dx, false, false);
        self._updateCameraTarget('y', $dy, false, true);

    };

    /**
     * Moves camera orthogonal to the ray between camera and target.
     *
     * @function
     * @private
     * @param {number} direction
     */
    this._moveOrtho = function (direction) {

        // Calculates advance angle
        let $ang = Math.atan2(self._three_camera.position.x - self.objects_props.camera.target.y, self._three_camera.position.z - self.objects_props.camera.target.x);
        $ang += Math.PI / 2;

        // Calculate displacements
        let $dx, $dy;
        $dx = self.objects_props.camera.targetSpeed.x * Math.cos($ang) * direction;
        $dy = self.objects_props.camera.targetSpeed.y * Math.sin($ang) * direction;

        // Add to components
        self._updateCameraTarget('x', $dx, false, false);
        self._updateCameraTarget('y', $dy, false, true);

    };

    /**
     * Moves camera in +Z axis.
     *
     * @function
     * @private
     * @param {number} direction
     */
    this._moveVertical = function (direction) {
        self._updateCameraTarget('z', self.objects_props.camera.targetSpeed.z * direction, false, true);
    };

    /**
     * Rotates objective.
     *
     * @function
     * @private
     * @param {number} direction
     */
    this._rotateTarget = function (direction) {

        // Get angle
        let $ang = Math.PI + Math.atan2(self._three_camera.position.x - self.objects_props.camera.target.y, self._three_camera.position.z - self.objects_props.camera.target.x);

        // Add angular velocity
        $ang += direction * self.objects_props.camera.targetSpeed.angular;

        // Calcualtes radius
        let $r = self._dist2(self._three_camera.position.x - self.objects_props.camera.target.y, self._three_camera.position.z - self.objects_props.camera.target.x);

        // Calculate new position
        self.objects_props.camera.target.x = self._three_camera.position.z + $r * Math.cos($ang);
        self.objects_props.camera.target.y = self._three_camera.position.x + $r * Math.sin($ang);

        // Check limits
        self._checkCameraTargetLimits('x', -self._worldsize.x, self._worldsize.x);
        self._checkCameraTargetLimits('y', -self._worldsize.y, self._worldsize.y);

        // Updates camera and render
        self._setCameraTarget();
        self._render();

    };

    /**
     * Moves camera forward.
     *
     * @function
     * @private
     */
    this._moveForward = function () {
        this._moveParallel(-1);
    };

    /**
     * Moves camera backward.
     *
     * @function
     * @private
     */
    this._moveBackward = function () {
        this._moveParallel(1);
    };

    /**
     * Moves camera left.
     *
     * @function
     * @private
     */
    this._moveLeft = function () {
        this._moveOrtho(-1);
    };

    /**
     * Moves camera right.
     *
     * @function
     * @private
     */
    this._moveRight = function () {
        this._moveOrtho(1);
    };

    /**
     * Moves camera up.
     *
     * @function
     * @private
     */
    this._moveUp = function () {
        this._moveVertical(1);
    };

    /**
     * Moves camera down.
     *
     * @function
     * @private
     */
    this._moveDown = function () {
        this._moveVertical(-1);
    };

    /**
     * Rotate camera left.
     *
     * @function
     * @private
     */
    this._rotateLeft = function () {
        this._rotateTarget(1);
    };

    /**
     * Rotate camera right.
     *
     * @function
     * @private
     */
    this._rotateRight = function () {
        this._rotateTarget(-1);
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
     * Init events.
     *
     * @function
     * @protected
     */
    this._initEvents = function () {

        if (isNullUndf(this._canvasParent)) return;

        /**
         * Canvas orbitcontrols
         */
        this._canvasParent.on(self._eventID.mousewheel, function (e) {
            stopWheelEvent(e);
            e.preventDefault();
            self._animateFrame();
        });

        /**
         * Disable left click
         */
        this._canvasParent.on(self._eventID.mousedown, function (e) {
            e.preventDefault();
            self.focus();
            self._animateFrame();
            self._hasMouseOver = true;
            self._hasMousePressed = true;
        });

        /**
         * Focus
         */
        this._canvasParent.on('blur', function () {
        });

        /**
         * Mouse inside canvas
         */
        this._canvasParent.on(self._eventID.mouseover, function () {
            self._hasMouseOver = true;
        });
        this._canvasParent.on(self._eventID.mouseout, function () {
            self._hasMouseOver = false;
        });

        /**
         * Mouse press
         */
        this._canvasParent.on('mousedown.canvas', function (e) {
            e.preventDefault();
            self._hasMousePressed = true;
        });

        /**
         * Mouseup
         */
        this._canvasParent.on('mouseup.canvas', function (e) {
            e.preventDefault();
            self._hasMousePressed = false;
            setTimeout(function () {
                self._mouseMoveDrag = false;
            }, 50);
        });

        /**
         * Left click
         */
        this._canvasParent.on(self._eventID.click, function (e) {
            e.preventDefault();
        });

        /**
         * Right click
         */
        this._canvasParent.on(self._eventID.contextmenu, function (e) {
            e.preventDefault();
        });

        // noinspection JSUnusedLocalSymbols
        /**
         * Move mouse around canvas
         */
        app_dom.window.on(self._windowMouseMoveEvent, function (e) {

            // e.preventDefault();
            self._mouseMoveDrag = self._hasMousePressed && true;

        });

        /**
         * Presión de botones sobre el canvas al tener el foco activo
         */
        this._canvasParent.on(self._eventID.keydown, function (e) {
            e.preventDefault(); // Cancel all default buttons
            e.stopPropagation();

            // Set key pressed
            self._hasKeyPressed = true;

            // If pressed mouse returns
            if (self._hasMousePressed) return;

            switch (e.which) {
                case 87: // [W]
                    self._moveForward();
                    break;
                case 83: // [S]
                    self._moveBackward();
                    break;
                case 65: // [A]
                    self._moveLeft();
                    break;
                case 68: // [D]
                    self._moveRight();
                    break;
                case 38: // [UP ARROW}
                    self._moveForward();
                    break;
                case 40: // [DOWN ARROW]
                    self._moveBackward();
                    break;
                case 37: // [LEFT ARROW]
                    self._rotateLeft();
                    break;
                case 39: // [RIGHT ARROW]
                    self._rotateRight();
                    break;
                case 81: // [Q]
                    self._moveDown();
                    break;
                case 69: // [E]
                    self._moveUp();
                    break;
                default: // Se ignoran otros input
                    break;
            }
        });
        this._canvasParent.on(self._eventID.keyup, function () {
            self._hasKeyPressed = false;
        });

        /**
         * Canvas resize
         */
        this._threeResize(true);

    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Stop rendering thread.
     *
     * @function
     * @protected
     */
    this.stopAnimate = function () {
        self._animateThread = false;
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Reset camera.
     *
     * @function
     * @private
     */
    this._resetCamera = function () {
        self._setInitialCameraPosition();
        self._animateFrame();
    };

    /**
     * Enables/disables helpers.
     *
     * @function
     * @private
     */
    this._toggleHelper = function () {
        self._drawHelpers();
        self._animateFrame();
        self.focus();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hide/show axis.
     *
     * @function
     * @private
     */
    this._toggleAxis = function () {
        self.threejs_helpers.axis = !self.threejs_helpers.axis;
        self._toggleHelper();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hide/show grid.
     *
     * @function
     * @private
     */
    this._toggleGrid = function () {
        self.threejs_helpers.grid = !self.threejs_helpers.grid;
        self._toggleHelper();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hide/show world limits.
     *
     * @function
     * @private
     */
    this._toggleWorldLimits = function () {
        self.threejs_helpers.worldlimits = !self.threejs_helpers.worldlimits;
        self._toggleHelper();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hide/show camera target.
     *
     * @function
     * @private
     */
    this._toggleCameraTarget = function () {
        self.threejs_helpers.cameratarget = !self.threejs_helpers.cameratarget;
        self._toggleHelper();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Hide/show planes.
     *
     * @function
     * @private
     */
    this._togglePlanes = function () {
        self.threejs_helpers.planes = !self.threejs_helpers.planes;
        self._toggleHelper();
    };

    /**
     * Hide/show GUI.
     *
     * @function
     * @private
     */
    this._toggleGUI = function () {
        self.threejs_helpers.gui = !self.threejs_helpers.gui;
        if (self.threejs_helpers.gui) {
            self._buildGUI();
        } else {
            self._destroyGUI();
        }
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
            self._animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'far', 100, 10000).onChange(function (val) {
            self._three_camera.far = val;
            self._three_camera.updateProjectionMatrix();
            self._animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'zoom', 0.1, 10).onChange(function (val) {
            self._three_camera.zoom = val;
            self._three_camera.updateProjectionMatrix();
            self._animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'maxdistance', 100, 5 * self._worldsize.diagl).onChange(function (val) {
            self._controls.maxDistance = val;
            self._animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'maxpolarangle', 0, Math.PI).onChange(function (val) {
            self._controls.maxPolarAngle = val;
            self._animateFrame();
        });
        camerafolder.add(this._guiCameraParams, 'posx', 1, 2 * self._worldsize.diagl).onChange(function (val) {
            self._three_camera.position.z = val;
            self._animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'posy', 1, 2 * self._worldsize.diagl).onChange(function (val) {
            self._three_camera.position.x = val;
            self._animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'posz', 1, 2 * self._worldsize.diagl).onChange(function (val) {
            self._three_camera.position.y = val;
            self._animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationx', -Math.PI, Math.PI).onChange(function (val) {
            self._three_camera.rotation.z = val;
            self._animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationy', -Math.PI, Math.PI).onChange(function (val) {
            self._three_camera.rotation.x = val;
            self._animateFrame();
        }).listen();
        camerafolder.add(this._guiCameraParams, 'rotationz', -Math.PI / 2, Math.PI / 2).onChange(function (val) {
            self._three_camera.rotation.y = val;
            self._animateFrame();
        }).listen();

        /**
         * Adds GUI to DIV
         */
        $('#' + this._guiID).append(this._gui.domElement);

        /**
         * GUI starts closed
         */
        if (this.threejs_helpers.guistartclosed) {
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds FPS meter.
     *
     * @function
     * @private
     */
    this._toggleFPSMeter = function () {

        // If not enabled
        if (!self.threejs_helpers.fpsmeter) return;

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
        if (this.threejs_helpers.axis) {
            if (isNullUndf(this._helperInstances.axis)) {
                let $helpersize = Math.min(self._worldsize.x, self._worldsize.y, self._worldsize.z) * self.threejs_helpers.axissize;
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
        if (this.threejs_helpers.planes) {
            if (isNullUndf(this._helperInstances.planes)) {
                let $planes = [];

                // Colors
                let materialx = new THREE.MeshBasicMaterial({
                    color: self.threejs_helpers.planecolorx,
                    opacity: self.threejs_helpers.planeopacity,
                });
                let materialy = new THREE.MeshBasicMaterial({
                    color: self.threejs_helpers.planecolory,
                    opacity: self.threejs_helpers.planeopacity,
                });
                let materialz = new THREE.MeshBasicMaterial({
                    color: self.threejs_helpers.planecolorz,
                    opacity: self.threejs_helpers.planeopacity,
                });
                materialx.wireframe = true;
                materialx.aoMapIntensity = self.threejs_helpers.planeopacity;
                materialy.wireframe = true;
                materialy.aoMapIntensity = self.threejs_helpers.planeopacity;
                materialz.wireframe = true;
                materialz.aoMapIntensity = self.threejs_helpers.planeopacity;

                // Geometry
                let geometry, plane;

                // X plane
                geometry = new THREE.Geometry();
                geometry.vertices.push(
                    this._newThreePoint(this._worldsize.x, 0, 0),
                    this._newThreePoint(-this._worldsize.x, 0, 0),
                    this._newThreePoint(-this._worldsize.x, 0, this._worldsize.z),
                    this._newThreePoint(this._worldsize.x, 0, this._worldsize.z)
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
                    this._newThreePoint(0, -this._worldsize.y, 0),
                    this._newThreePoint(0, this._worldsize.y, 0),
                    this._newThreePoint(0, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(0, -this._worldsize.y, this._worldsize.z)
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
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, 0),
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, 0)
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
        if (this.threejs_helpers.grid) {
            if (isNullUndf(this._helperInstances.grid)) {
                let $mapsize = 2 * Math.max(this._worldsize.x, this._worldsize.y);
                let $griddist = Math.floor(2 / this.threejs_helpers.griddist);
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
        if (this.threejs_helpers.worldlimits) {
            if (isNullUndf(this._helperInstances.worldlimits)) {
                let material = new THREE.MeshBasicMaterial({
                    color: self.threejs_helpers.worldlimitscolor,
                    opacity: self.threejs_helpers.planeopacity
                });
                material.wireframe = true;
                material.aoMapIntensity = 0.5;
                let geometry = new THREE.Geometry();
                geometry.vertices.push(
                    // +X
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, 0),
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, this._worldsize.z),

                    // +Y
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, this._worldsize.z),

                    // -X
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, this._worldsize.z),

                    // -Y
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, 0),
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, this._worldsize.z),

                    // Z
                    this._newThreePoint(this._worldsize.x, -this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(this._worldsize.x, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(-this._worldsize.x, this._worldsize.y, this._worldsize.z),
                    this._newThreePoint(-this._worldsize.x, -this._worldsize.y, this._worldsize.z)
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
        if (this.threejs_helpers.cameratarget) {
            if (isNullUndf(this._helperInstances.cameratarget)) {
                let $targetsize = Math.min(self._worldsize.x, self._worldsize.y, self._worldsize.z) * self.threejs_helpers.cameratargetsize / 2;
                let sphereGeometry = new THREE.SphereGeometry($targetsize, 16, 8);
                let wireframeMaterial = new THREE.MeshBasicMaterial(
                    {
                        color: self.threejs_helpers.cameratargetcolor,
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
                    update: this._helpersUpdate.length - 1,
                    obj: mesh
                }
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
     * Add mesh to scene.
     *
     * @function
     * @private
     * @param {Object3D} mesh - Mesh
     * @param {string} name - Object name
     * @param {boolean=} collaidable
     */
    this._addMeshToScene = function (mesh, name, collaidable) {
        mesh.name = name;
        self._scene.add(mesh);
        if (collaidable) self._addToCollidable(mesh);
    };

    /**
     * Add mesh to collaidable elements.
     *
     * @function
     * @private
     * @param {object} mesh
     */
    this._addToCollidable = function (mesh) {
        this._collaidableMeshes.push(mesh);
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
     * @since 0.1.3
     */
    this.init = function (parentElement) {
        self.id = parentElement;
        self._canvasParent = $(parentElement);
        self._initThree();
        self._initWorldObjects();
        self._initEvents();
        self._animateFrame();
        loadingHandler(false);
    };

    /**
     * Creates new game.
     *
     * @function
     * @param {Volume} volume
     */
    this.new = function (volume) {
        this._draw_volume(volume);
    };

    /**
     * Draw volume.
     *
     * @function
     * @param {Volume} volume
     * @private
     */
    this._draw_volume = function (volume) {

        // Destroy geometry if added
        if (notNullUndf(this._viewerMesh)) {
            this._scene.remove(this._viewerMesh);
        }

        // Create new geometry
        let geometryMerge = new THREE.Geometry();
        let mergeMaterials = [];
        let meshNames = [];

        // Draw each face
        let faces = volume.get_faces();
        for (let i = 0; i < faces.length; i += 1) {
            this._draw_face(faces[i], geometryMerge, mergeMaterials, meshNames);
        }

        let shapeMesh = new THREE.Mesh(geometryMerge, new THREE.MeshBasicMaterial({
            color: 0x404040
        }));
        this._scene.add(shapeMesh);

    };

    /**
     * Draw face.
     *
     * @function
     * @param {Face} face - Face to draw
     * @param {Geometry} geometry - Three.js geometry buffer
     * @param {object[]} material - Material
     * @param {string[]} name - Name lists
     * @private
     */
    this._draw_face = function (face, geometry, material, name) {

        let points = face.get_threejs_points();
        let normal = face.get_normal();
        let normalZ = new THREE.Vector3(0, 0, 1);
        let quaternion = new THREE.Quaternion().setFromUnitVectors(normal, normalZ);
        let quaternionBack = new THREE.Quaternion().setFromUnitVectors(normalZ, normal);
        points.forEach(p => {
            p.applyQuaternion(quaternion)
        });

        // noinspection JSCheckFunctionSignatures
        let shape = new THREE.Shape(points);
        let shapeGeom = new THREE.ShapeGeometry(shape);
        points.forEach(p => {
            p.applyQuaternion(quaternionBack)
        });
        shapeGeom.vertices = points;
        geometry.merge(shapeGeom);
        name.push(face.get_name());
        material.push(true);

    };

}