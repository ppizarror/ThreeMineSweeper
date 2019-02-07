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
            self._viewer.animate_frame();
        });

        /**
         * Disable left click
         */
        this._canvasParent.on(self._eventID.mousedown, function (e) {
            e.preventDefault();
            self._viewer.focus();
            self._viewer.animate_frame();
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
            self._faceHover(null);

            // Set key pressed
            self._hasKeyPressed = true;

            // Check Alt+key events
            if (e.altKey) {
                switch (e.which) {
                    case 49: // [1]
                        self._viewer.reset_camera();
                        break;
                    case 50: // [2]
                        self._viewer.toggle_axis();
                        break;
                    case 51: // [3]
                        self._viewer.toggle_camera_target();
                        break;
                    case 52: // [4]
                        self._viewer.toggle_fps_meter();
                        break;
                    case 53: // [5]
                        self._viewer.toggle_grid();
                        break;
                    case 54: // [6]
                        self._viewer.toggle_gui();
                        break;
                    case 55: // [7]
                        self._viewer.toggle_world_limits();
                        break;
                    case 56: // [8]
                        self._viewer.toggle_planes();
                        break;
                    case 57: // [9]
                        self._viewer.show_renderer_info();
                        break;
                    default:
                        break;
                }
                return;
            }

            // Switch between single keys
            switch (e.which) {
                case 87: // [W]
                    self._viewer.objects_props.camera.movements.forward = true;
                    break;
                case 83: // [S]
                    self._viewer.objects_props.camera.movements.backward = true;
                    break;
                case 65: // [A]
                    self._viewer.objects_props.camera.movements.left = true;
                    break;
                case 68: // [D]
                    self._viewer.objects_props.camera.movements.right = true;
                    break;
                case 38: // [UP ARROW}
                    self._viewer.objects_props.camera.movements.angleup = true;
                    break;
                case 40: // [DOWN ARROW]
                    self._viewer.objects_props.camera.movements.angledown = true;
                    break;
                case 37: // [LEFT ARROW]
                    self._viewer.objects_props.camera.movements.angleleft = true;
                    break;
                case 39: // [RIGHT ARROW]
                    self._viewer.objects_props.camera.movements.angleright = true;
                    break;
                case 81: // [Q]
                    self._viewer.objects_props.camera.movements.zup = true;
                    break;
                case 69: // [E]
                    self._viewer.objects_props.camera.movements.zdown = true;
                    break;
                default: // Ignore other inputs
                    break;
            }

        });

        /**
         * Key release
         */
        this._canvasParent.on(self._eventID.keyup, function (e) {
            e.preventDefault(); // Cancel all default buttons
            e.stopPropagation();
            self._hasKeyPressed = false;

            // Switch between single keys
            switch (e.which) {
                case 87: // [W]
                    self._viewer.objects_props.camera.movements.forward = false;
                    break;
                case 83: // [S]
                    self._viewer.objects_props.camera.movements.backward = false;
                    break;
                case 65: // [A]
                    self._viewer.objects_props.camera.movements.left = false;
                    break;
                case 68: // [D]
                    self._viewer.objects_props.camera.movements.right = false;
                    break;
                case 38: // [UP ARROW}
                    self._viewer.objects_props.camera.movements.angleup = false;
                    break;
                case 40: // [DOWN ARROW]
                    self._viewer.objects_props.camera.movements.angledown = false;
                    break;
                case 37: // [LEFT ARROW]
                    self._viewer.objects_props.camera.movements.angleleft = false;
                    break;
                case 39: // [RIGHT ARROW]
                    self._viewer.objects_props.camera.movements.angleright = false;
                    break;
                case 81: // [Q]
                    self._viewer.objects_props.camera.movements.zup = false;
                    break;
                case 69: // [E]
                    self._viewer.objects_props.camera.movements.zdown = false;
                    break;
                default: // Ignore other inputs
                    break;
            }

        });

        /**
         * Canvas resize
         */
        this._viewer.three_resize(true);

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
        if (self._hasMousePressed || self._hasKeyPressed || !self._hasMouseOver || self._viewer.camera_is_moving()) {
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
        // return face.get_name();
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