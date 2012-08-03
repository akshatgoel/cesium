/*global defineSuite*/
defineSuite([
         'Scene/Polyline',
         '../Specs/createContext',
         '../Specs/destroyContext',
         '../Specs/sceneState',
         '../Specs/pick',
         'Core/Cartesian3',
         'Core/Matrix4',
         'Core/Math',
         'Renderer/BufferUsage'
     ], function(
         Polyline,
         createContext,
         destroyContext,
         sceneState,
         pick,
         Cartesian3,
         Matrix4,
         CesiumMath,
         BufferUsage) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    var context;
    var polyline;
    var us;

    beforeAll(function() {
        context = createContext();
    });

    afterAll(function() {
        destroyContext(context);
    });

    beforeEach(function() {
        polyline = new Polyline();

        var camera = {
            eye : new Cartesian3(-1.0, 0.0, 0.0),
            target : Cartesian3.ZERO,
            up : Cartesian3.UNIT_Z
        };

        us = context.getUniformState();
        us.setView(Matrix4.fromCamera(camera));
        us.setProjection(Matrix4.computePerspectiveFieldOfView(CesiumMath.toRadians(60.0), 1.0, 0.01, 10.0));
    });

    afterEach(function() {
        polyline = polyline && !polyline.isDestroyed() && polyline.destroy();
        us = undefined;
    });

    it('gets default show', function() {
        expect(polyline.show).toEqual(true);
    });

    it('sets positions', function() {
        var positions = [new Cartesian3(1.0, 2.0, 3.0), new Cartesian3(4.0, 5.0, 6.0)];

        expect(polyline.getPositions()).not.toBeDefined();

        polyline.setPositions(positions);
        expect(polyline.getPositions()).toEqual(positions);
    });

    it('gets the default width', function() {
        expect(polyline.width).toEqual(2);
    });

    it('gets the default outline-width', function() {
        expect(polyline.outlineWidth).toEqual(5);
    });

    it('gets the default color', function() {
        expect(polyline.color).toEqual({
            red : 0.0,
            green : 0.0,
            blue : 1.0,
            alpha : 1.0
        });
    });

    it('gets the default outline-color', function() {
        expect(polyline.outlineColor).toEqual({
            red : 1.0,
            green : 1.0,
            blue : 1.0,
            alpha : 1.0
        });
    });

    it('gets default bufferusage', function() {
        expect(polyline.bufferUsage).toEqual(BufferUsage.STATIC_DRAW);
    });

    it('updates', function() {
        polyline.update(context, sceneState);
    });

    it('renders', function() {
        polyline.setPositions([new Cartesian3(0.0, -1.0, 0.0), new Cartesian3(0.0, 1.0, 0.0)]);

        polyline.color = {
            red : 1.0,
            green : 0.0,
            blue : 0.0,
            alpha : 1.0
        };
        polyline.outlineColor = {
            red : 1.0,
            green : 0.0,
            blue : 0.0,
            alpha : 0.0
        };

        context.clear();
        expect(context.readPixels()).toEqual([0, 0, 0, 0]);

        polyline.update(context, sceneState);
        polyline.render(context, us);
        expect(context.readPixels()).not.toEqual([0, 0, 0, 0]);
    });

    it('does not renders', function() {
        polyline.setPositions([new Cartesian3(0.0, -1.0, 0.0), new Cartesian3(0.0, 1.0, 0.0)]);

        polyline.color = {
            red : 1.0,
            green : 0.0,
            blue : 0.0,
            alpha : 1.0
        };
        polyline.outlineColor = {
            red : 1.0,
            green : 0.0,
            blue : 0.0,
            alpha : 0.0
        };
        polyline.show = false;

        context.clear();
        expect(context.readPixels()).toEqual([0, 0, 0, 0]);

        polyline.update(context, sceneState);
        polyline.render(context, us);
        expect(context.readPixels()).toEqual([0, 0, 0, 0]);
    });

    it('is picked', function() {
        polyline.setPositions([new Cartesian3(0.0, -1.0, 0.0), new Cartesian3(0.0, 1.0, 0.0)]);

        polyline.update(context, sceneState);

        var pickedObject = pick(context, polyline, 0, 0);
        expect(pickedObject).toEqual(polyline);
    });

    it('is not picked', function() {
        polyline.setPositions([new Cartesian3(0.0, -1.0, 0.0), new Cartesian3(0.0, 1.0, 0.0)]);
        polyline.show = false;

        polyline.update(context, sceneState);

        var pickedObject = pick(context, polyline, 0, 0);
        expect(pickedObject).not.toBeDefined();
    });

    it('isDestroyed', function() {
        expect(polyline.isDestroyed()).toEqual(false);
        polyline.destroy();
        expect(polyline.isDestroyed()).toEqual(true);
    });
});