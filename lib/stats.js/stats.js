/* eslint-disable no-extra-parens,block-scoped-var,no-plusplus,no-use-before-define */
/**
 * @author mrdoob / http://mrdoob.com/
 */

let Stats = function () {

    let mode = 0;

    let container = document.createElement('div');
    container.className = 'stats-panel';
    container.style.cssText = 'cursor:pointer;z-index:10000';
    container.addEventListener('click', function (event) {
        event.preventDefault();
        showPanel(++mode % container.children.length);
    }, false);

    /**
     * Adds panel
     * @param panel
     * @return {*}
     */
    function addPanel(panel) {
        container.appendChild(panel.dom);
        return panel;
    }

    /**
     * Display panel
     * @param id
     */
    function showPanel(id) {
        for (let i = 0; i < container.children.length; i++) {
            container.children[i].style.display = i === id ? 'block' : 'none';
        }
        mode = id;
    }

    let beginTime = (performance || Date).now();
    let prevTime = beginTime;
    let frames = 0;
    let fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
    let msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));
    let memPanel = null;
    let fps = 0;

    if (self.performance && self.performance.memory) {
        memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
    }

    showPanel(0);

    // noinspection JSUnusedGlobalSymbols
    return {

        // Revision
        REVISION: 16,

        // DOM object
        dom: container,

        // Display chart
        display: true,

        // Adds panel
        addPanel: addPanel,

        // Shows panel
        showPanel: showPanel,

        // Initialize
        initialize: function () {
            if (!this.display) {
                fpsPanel.hide();
                msPanel.hide();
                if (memPanel !== null) memPanel.hide();
            }
        },

        // Get current FPS
        getFPS: function () {
            return fps;
        },

        // Begin fps
        begin: function () {
            beginTime = (performance || Date).now();
        },

        // End fps
        end: function () {
            frames++;
            let time = (performance || Date).now();
            msPanel.update(time - beginTime, 200);

            if (time >= prevTime + 1000) {

                fps = (frames * 1000) / (time - prevTime);
                if (this.display) fpsPanel.update(fps, 100);
                prevTime = time;
                frames = 0;

                if (memPanel && this.display) {
                    let memory = performance.memory;
                    // noinspection JSUnresolvedVariable
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                }
            }
            return time;
        },

        update: function () {
            beginTime = this.end();
        },

        // Backwards Compatibility
        domElement: container,

        // Set mode
        setMode: showPanel

    };
};

Stats.Panel = function (name, fg, bg) {
    let min = Infinity;
    let max = 0;
    let round = Math.round;
    let PR = round(window.devicePixelRatio || 1);

    let WIDTH = 80 * PR;
    let HEIGHT = 48 * PR;
    let TEXT_X = 3 * PR;
    let TEXT_Y = 2 * PR;
    let GRAPH_X = 3 * PR;
    let GRAPH_Y = 15 * PR;
    let GRAPH_WIDTH = 74 * PR;
    let GRAPH_HEIGHT = 30 * PR;

    let canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';

    let context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    return {

        dom: canvas,

        hide: function () {
            canvas.style.display = 'none';
        },

        update: function (value, maxValue) {
            min = Math.min(min, value);
            max = Math.max(max, value);
            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);
            // noinspection JSCheckFunctionSignatures
            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }

    };

};