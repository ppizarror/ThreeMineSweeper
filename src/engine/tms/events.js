/**
 EVENTS
 Game events.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Manages application events.
 *
 * @class
 * @constructor
 */
function TMSEvents() {
    /* eslint-disable new-cap */
    /* eslint-disable no-extra-parens */
    /* eslint-disable no-mixed-operators */

    /**
     * ------------------------------------------------------------------------
     * Events variables
     * ------------------------------------------------------------------------
     */

    /**
     * Stores viewer reference.
     * @type {TMSViewer}
     * @private
     */
    this._viewer = null;

    /**
     * Button is pressed.
     * @type {boolean}
     * @private
     */
    this._hasKeyPressed = false;

    /**
     * Mouse over canvas.
     * @type {boolean}
     * @private
     */
    this._hasMouseOver = false;

    /**
     * Mouse is pressed.
     * @type {boolean}
     * @private
     */
    this._hasMousePressed = false;

    /**
     * Mouse is pressed and dragged.
     * @type {boolean}
     * @private
     */
    this._mouseMoveDrag = false;

    /**
     * Mouse is pressed.
     * @type {boolean}
     * @private
     */
    this._mouseKeepPressed = false;

    /**
     * Event IDs.
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
        windowmousemove: 'mousemove.rectzoom',
    };

    /**
     * Mouse coordinates.
     * @private
     */
    this._mouse = {
        x: 0,
        y: 0,
        inside: false,
    };

    /**
     * Last hovered face.
     * @type {Face | null}
     * @private
     */
    this._lastHoverFace = null;

    /**
     * Stores volume.
     * @type {Volume}
     * @private
     */
    this._volume = null;

    /**
     * Stores camera reference.
     * @type {PerspectiveCamera}
     * @private
     */
    this._three_camera = null;

    /**
     * DIV canvas.
     * @type {JQuery | jQuery | HTMLElement | null}
     * @protected
     */
    this._canvasParent = null;

    /**
     * Stores scene.
     * @type {THREE.Scene|Scene}
     * @private
     */
    this._scene = null;

    /**
     * Raycaster reference.
     * @type {Raycaster}
     * @private
     */
    this._raycaster = null;

    /**
     * Minesweeper reference.
     * @type {Minesweeper}
     * @private
     */
    this._minesweeper = null;

    /**
     * Stores object reference.
     * @type {TMSEvents}
     */
    let self = this;


    /**
     * ------------------------------------------------------------------------
     * Events methods
     * ------------------------------------------------------------------------
     */

    /**
     * Stores viewer.
     *
     * @function
     * @param {TMSViewer} v
     */
    this.set_viewer = function (v) {
        self._viewer = v;
        self._three_camera = v.get_camera();
        self._canvasParent = v.get_canvas_parent();
        self._scene = v.get_scene();
        self._raycaster = v.get_raycaster();
    };

    /**
     * Set minesweeper reference.
     *
     * @function
     * @param {Minesweeper} m
     */
    this.set_minesweeper = function (m) {
        self._minesweeper = m;
    };

    /**
     * Stores volume reference.
     *
     * @function
     * @param {Volume} volume
     */
    this.set_volume = function (volume) {
        this._volume = volume;
    };

    /**
     * Init events.
     *
     * @function
     */
    this.initEvents = function () {

        if (isNullUndf(this._canvasParent)) return;

        /**
         * Canvas orbitcontrols
         */
        this._canvasParent.on(self._eventID.mousewheel, function (e) {
            stopWheelEvent(e);
            e.preventDefault();
            self._viewer.animateFrame();
        });

        /**
         * Disable left click
         */
        this._canvasParent.on(self._eventID.mousedown, function (e) {
            e.preventDefault();
            self._viewer.focus();
            self._viewer.animateFrame();
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
            }, 20);
        });

        /**
         * Left click
         */
        this._canvasParent.on(self._eventID.click, function (e) {
            e.preventDefault();
            if (self._mouseMoveDrag || self._mouseKeepPressed) return;
            self._minesweeper.play(self._lastHoverFace, true, self._viewer);
        });

        /**
         * Right click
         */
        this._canvasParent.on(self._eventID.contextmenu, function (e) {
            e.preventDefault();
            self._minesweeper.play(self._lastHoverFace, false, self._viewer);
        });

        /**
         * Move mouse around canvas
         */
        app_dom.window.on(self._eventID.windowmousemove, function (e) {
            // e.preventDefault();
            self._mouseMoveDrag = self._hasMousePressed && true;
            if (self._mouseMoveDrag) self._faceHover(null);
            self._mouseHandler(e);
        });

        /**
         * Press button on active canvas
         */
        this._canvasParent.on(self._eventID.keydown, function (e) {
            e.preventDefault(); // Cancel all default buttons
            e.stopPropagation();

            // Set key pressed
            self._hasKeyPressed = true;

            // If pressed mouse returns
            if (self._hasMousePressed) return;

            // Check Alt+key events
            if (e.altKey) {
                switch (e.which) {
                    case 49: // [1]
                        self._viewer.resetCamera();
                        break;
                    case 50: // [2]
                        self._viewer.toggleAxis();
                        break;
                    case 51: // [3]
                        self._viewer.toggleCameraTarget();
                        break;
                    case 52: // [4]
                        self._viewer.toggleFPSMeter();
                        break;
                    case 53: // [5]
                        self._viewer.toggleGrid();
                        break;
                    case 54: // [6]
                        self._viewer.toggleGUI();
                        break;
                    case 55: // [7]
                        self._viewer.toggleWorldLimits();
                        break;
                    case 56: // [8]
                        self._viewer.togglePlanes();
                        break;
                    case 57: // [9]
                        self._viewer.showRendererInfo();
                        break;
                    default:
                        break;
                }
                return;
            }

            // Switch between single keys
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
                default: // Ignore other inputs
                    break;
            }

        });
        this._canvasParent.on(self._eventID.keyup, function () {
            self._hasKeyPressed = false;
        });

        /**
         * Canvas resize
         */
        this._viewer.threeResize(true);

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
        self._viewer.objects_props.camera.target[axis] += val;
        return true;
    };

    /**
     * Update camera target.
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
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, -self._viewer.worldsize.x, self._viewer.worldsize.x) && self._viewer.objects_props.camera.targetMoveCamera) {
                    self._three_camera.position.z += val;
                }
                break;
            case 'y':
                if (flipSignPos) { // Updates factor depending the position of the camera
                    $factor = Math.sign(self._three_camera.position.x);
                }
                val *= $factor;

                // Updates target and camera
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, -self._viewer.worldsize.y, self._viewer.worldsize.y) && self._viewer.objects_props.camera.targetMoveCamera) {
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
                if (self._checkCameraTargetCollision(dir, val) && self._checkCameraTargetLimits(dir, -self._viewer.worldsize.z, self._viewer.worldsize.z) && self._viewer.objects_props.camera.targetMoveCamera) {
                    self._three_camera.position.y += val;
                }
                break;
            default:
                break;
        }
        if (setTarget) self._viewer.setCameraTarget();

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
        let $pos = self._viewer.objects_props.camera.target[axis];
        if (min <= $pos && $pos <= max) {
            return true;
        }
        self._viewer.objects_props.camera.target[axis] = Math.min(max, Math.max($pos, min));
        return false;
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
        let $ang = Math.atan2(self._three_camera.position.x - self._viewer.objects_props.camera.target.y, self._three_camera.position.z - self._viewer.objects_props.camera.target.x);

        // Calculate displacements
        let $dx, $dy;
        $dx = self._viewer.objects_props.camera.targetSpeed.x * Math.cos($ang) * direction;
        $dy = self._viewer.objects_props.camera.targetSpeed.y * Math.sin($ang) * direction;

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
        let $ang = Math.atan2(self._three_camera.position.x - self._viewer.objects_props.camera.target.y, self._three_camera.position.z - self._viewer.objects_props.camera.target.x);
        $ang += Math.PI / 2;

        // Calculate displacements
        let $dx, $dy;
        $dx = self._viewer.objects_props.camera.targetSpeed.x * Math.cos($ang) * direction;
        $dy = self._viewer.objects_props.camera.targetSpeed.y * Math.sin($ang) * direction;

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
        self._updateCameraTarget('z', self._viewer.objects_props.camera.targetSpeed.z * direction, false, true);
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
        let $ang = Math.PI + Math.atan2(self._three_camera.position.x - self._viewer.objects_props.camera.target.y, self._three_camera.position.z - self._viewer.objects_props.camera.target.x);

        // Add angular velocity
        $ang += direction * self._viewer.objects_props.camera.targetSpeed.angular;

        // Calcualtes radius
        let $r = self._viewer.dist2(self._three_camera.position.x - self._viewer.objects_props.camera.target.y, self._three_camera.position.z - self._viewer.objects_props.camera.target.x);

        // Calculate new position
        self._viewer.objects_props.camera.target.x = self._three_camera.position.z + $r * Math.cos($ang);
        self._viewer.objects_props.camera.target.y = self._three_camera.position.x + $r * Math.sin($ang);

        // Check limits
        self._checkCameraTargetLimits('x', -self._viewer.worldsize.x, self._viewer.worldsize.x);
        self._checkCameraTargetLimits('y', -self._viewer.worldsize.y, self._viewer.worldsize.y);

        // Updates camera and render
        self._viewer.setCameraTarget();
        self._viewer.render();

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
     * Handles mouse.
     *
     * @function
     * @param {Object} e - Event
     * @private
     */
    this._mouseHandler = function (e) {

        /**
         * Check events
         */
        if (self._hasMousePressed || self._hasKeyPressed || !self._hasMouseOver) {
            self._viewer.objects_props.tooltip.obj.css('display', 'none');
            return;
        }

        /**
         * Get general dimensions
         */
        let $offset = self._canvasParent.offset();
        let $wh = self._canvasParent.innerHeight();
        let $ww = self._canvasParent.innerWidth();

        /**
         * Mouse position inside window
         */
        let $x = e.clientX - $offset.left + app_dom.window.scrollLeft();
        let $y = e.clientY - $offset.top + app_dom.window.scrollTop();

        /**
         * Tooltip position
         */
        let $tx = 0;
        let $ty = 0;
        let $contentw = 0;

        /**
         * Check mouse is inside canvas
         */
        let $show = ($x >= 0 && $x <= $ww) && ($y >= 0 && $y <= $wh);

        /**
         * Updates mouse
         */
        self._mouse.inside = $show;
        self._mouse.x = (($x / $ww) * 2) - 1;
        self._mouse.y = (-($y / $wh) * 2) + 1;

        /**
         * Apply raycast
         */
        self._raycaster.setFromCamera(self._mouse, self._three_camera);
        let intersects = self._raycaster.intersectObjects(self._scene.children, false);

        /**
         * Check results
         */
        if (isNullUndf(intersects) || intersects.length === 0) {
            $show = false;
            self._faceHover(null);
        } else { // Intersected

            let faceID = ''; // Face identificator
            let $content = ''; // Tooltip content

            // Look for face collision
            for (let i = 0; i < self._viewer.objects_props.tooltip.modes.length; i += 1) {
                faceID += self._viewer.objects_props.tooltip.modes[i](intersects);
            }

            // Get face
            let $face = parseInt(faceID, 10);
            if (!isNaN($face)) {
                let faces = this._volume.get_faces();
                if ($face >= 0 && $face < faces.length) {
                    $content = this._faceMouseHandler(faces[$face]);
                }
            } else {
                this._faceHover(null);
            }

            // Write content
            self._viewer.objects_props.tooltip.obj.html($content);

            /**
             * Display tooltip content
             */
            if ($content === '' && self._viewer.objects_props.tooltip.ignoreEmpty) {
                $show = false;
            } else {

                // Check position of tooltip
                $contentw = self._viewer.objects_props.tooltip.obj.outerWidth();

                // Tooltip left
                if ($contentw !== 0 && ($contentw + e.clientX + self._viewer.objects_props.tooltip.left + app_dom.window.scrollLeft()) > app_dom.window.width()) {

                    // Remove classes
                    self._viewer.objects_props.tooltip.obj.addClass('tooltip-left');
                    self._viewer.objects_props.tooltip.obj.removeClass('tooltip-right');

                    // Get position
                    $ty = e.clientY + self._viewer.objects_props.tooltip.top + app_dom.window.scrollTop();
                    $tx = e.clientX - self._viewer.objects_props.tooltip.left + app_dom.window.scrollLeft() - $contentw;

                }

                // Tooltip right
                else {

                    // Remove classes
                    self._viewer.objects_props.tooltip.obj.addClass('tooltip-right');
                    self._viewer.objects_props.tooltip.obj.removeClass('tooltip-left');

                    // Get website size
                    let $wwidth = app_dom.window.width();
                    let $mnwidth = app_dom.root.outerWidth();

                    // Calculate position
                    $tx = $x + self._viewer.objects_props.tooltip.left + $offset.left;
                    if ($wwidth > $mnwidth) {
                        $tx -= ($wwidth - $mnwidth) / 2;
                    }
                    $ty = e.clientY + self._viewer.objects_props.tooltip.top + app_dom.window.scrollTop();

                }

            }
        }

        /**
         * Tooltip style
         */
        self._viewer.objects_props.tooltip.obj.css({
            display: $show ? 'block' : 'none',
            left: $tx,
            top: $ty,
        });

    };

    /**
     * Handles mouse collision with a face.
     *
     * @function
     * @param {Face} face
     * @returns {string} - String to tooltip, if empty tooltip hides
     * @private
     */
    this._faceMouseHandler = function (face) {
        // app_console.info('FACE: {1}. N: {0}'.format(face.get_neighbours_strlist(), face.get_name()));
        this._faceHover(face);
        return '';
    };

    /**
     * Hovers face.
     *
     * @function
     * @param {Face | null} face
     * @private
     */
    this._faceHover = function (face) {
        if (isNullUndf(face) && isNullUndf(self._lastHoverFace)) return;
        if (isNullUndf(face) && notNullUndf(self._lastHoverFace) || notNullUndf(face) && notNullUndf(self._lastHoverFace) && !face.equals(self._lastHoverFace)) {
            let $mesh = self._lastHoverFace.get_mesh();
            if (self._lastHoverFace.is_played()) {
                $mesh.material.emissive = self._viewer.palette.face_unhover_played;
            } else {
                $mesh.material.emissive = self._viewer.palette.face_unhover_unplayed;
            }

            self._lastHoverFace = null;
            if (isNullUndf(face)) {
                this._viewer.render();
                return;
            }
        }
        if (!face.is_enabled()) return;
        let $mesh = face.get_mesh();
        if (face.is_played()) {
            $mesh.material.emissive = self._viewer.palette.face_hover_played;
        } else {
            $mesh.material.emissive = self._viewer.palette.face_hover_unplayed;
        }
        self._lastHoverFace = face;
        this._viewer.render();
    };

}