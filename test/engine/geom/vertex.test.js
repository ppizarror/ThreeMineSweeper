describe('Test vertex', function () {

    it('Test vertex creation', function () {
        let v = new Vertex(1, 2, 3);
        expect(v.get_x()).toBe(1);
        expect(v.get_y()).toBe(2);
        expect(v.get_z()).toBe(3);
    });

    it('Test distance', function () {
        let v = new Vertex(1, 2, 3);
        let v2 = new Vertex(4, 5, 6);
        expect(v.dist()).toBe(Math.sqrt(14));
        expect(v.dist(v2)).toBe(Math.sqrt(Math.pow(4 - 1, 2) +
            Math.pow(5 - 2, 2) + Math.pow(6 - 3, 2)));
    });

    it('Test sum/subtract', function () {
        let v = new Vertex(1, 2, 3);
        let v3 = new Vertex(-1, -2, -3);
        let v2 = new Vertex(4, 5, 6);
        v3.add(v);
        expect(v3.is_zero()).toBe(true);
        v3.add(v2);
        expect(!v3.is_zero()).toBe(true);
        expect(v3.close_to(v2)).toBe(true);
        v3.subtract(v2);
        expect(v3.is_zero()).toBe(true);
    });

    it('Test position modification', function () {
        let s = new Vertex();
        expect(s.is_zero()).toBe(true);
        s.set_x(1);
        expect(s.get_x()).toBe(1);
        s.set_y(2);
        expect(s.get_y()).toBe(2);
        s.set_z(3);
        expect(s.get_z()).toBe(3);
    });

    it('Test ccw definition', function () {
        let t1 = new Vertex(0, 0, 0);
        let t2 = new Vertex(0, 1, 0);
        let t3 = new Vertex(1, 1, 0);
        expect(t1.ccw(t2, t3)).toBe(true);
        expect(t2.ccw(t3, t1)).toBe(true);
        expect(t3.ccw(t1, t2)).toBe(true);
        expect(t1.ccw(t3, t2)).toBe(false);
        expect(t2.ccw(t1, t3)).toBe(false);
        expect(t3.ccw(t2, t1)).toBe(false);
        expect(t1.ccw(t1, t1)).toBe(false);
        expect(t1.ccw(t1, t2)).toBe(false);
    });

    it('Check face definition', function () {
        let f1 = new Face();
        let f2 = new Face();
        let f3 = new Face();
        let f4 = new Face();
        let tf = new Vertex();
        tf.add_face(f1);
        tf.add_face([f2, f3]);

        expect(tf.has_face(f1)).toBe(true);
        expect(tf.has_face(f4)).toBe(false);
        expect(tf.has_face([f1, f2, f3])).toBe(true);
        expect(tf.has_face([f1, f2, f4])).toBe(false);

        tf.remove_face(f1);
        expect(tf.has_face(f1)).toBe(false);
    });

    it('Test vertex scale position', function () {
        let v1 = new Vertex(1, 2, -1);
        v1.scale(0.5);
        expect(v1.get_x()).toBe(0.5);
        v1.scale(-1);
        expect(v1.get_z()).toBe(0.5);
        v1.scale(0.5, 1, 0, 0);
        expect(v1.get_z()).toBe(0);
    });

    it('Test vertex name', function () {
        let s = new Vertex();
        s.set_name('A');
        expect(s.get_name()).toBe('A');
    });

    /**
     * v1 ---- v2 ---- v6
     *  |  f1  |   f2  |
     *  |      |       |
     *  v4 --- v3 ---- v5
     */
    it('Test vertex prev/next', function () {
        let v1 = new Vertex(0, 1);
        let v2 = new Vertex(1, 1);
        let v3 = new Vertex(1, 0);
        let v4 = new Vertex(0, 0);
        let v5 = new Vertex(2, 0);
        let v6 = new Vertex(2, 1);
        let f1 = new Face();
        let f2 = new Face();
        f1.add_vertex([v1, v2, v3, v4]);
        f2.add_vertex([v5, v3, v2, v6]);

        // Check figures are ok
        expect(f1.is_valid()).toBe(true);
        expect(f2.is_valid()).toBe(true);

        // Check next/prev
        expect(v1.next(f1)).toBe(v2);
        expect(v2.next(f1)).toBe(v3);
        expect(v3.next(f1)).toBe(v4);
        expect(v4.next(f1)).toBe(v1);
        expect(v1.next(f2)).toBe(null);
        expect(v1.prev(f1)).toBe(v4);
        expect(v2.prev(f1)).toBe(v1);
        expect(v3.prev(f1)).toBe(v2);
        expect(v4.prev(f1)).toBe(v3);

        // Check next/prev with figures
        // eslint-disable-next-line newline-per-chained-call
        expect(v1.next(f1).next(f2).next(f2).next(f2).next(f1).next(f1)).toBe(v1);

        // Check faces
        expect(v1.get_faces().length).toBe(1);
        expect(v2.get_faces().length).toBe(2);
        expect(v3.get_faces().length).toBe(2);

        // Get neighbours faces
        expect(f1.get_neighbours()[0]).toBe(f2);
        expect(f1.get_neighbours().length).toBe(1);
        expect(f2.get_neighbours()[0]).toBe(f1);
    });

    it('Test equal vertices', function () {
        let v1 = new Vertex(1, 1 / 3, 2);
        let v2 = new Vertex(1, 1 / 3, 2);
        expect(v1.equal_position(v2)).toBe(true);
    });

    it('Test join replace', function () {
        let v1 = new Vertex();
        let v2 = new Vertex(1, 0);
        let v3 = new Vertex(1, 1);
        let vr = new Vertex();
        let f1 = new Face([v1, v2, v3]);
        let f2 = new Face([vr, v2, v3]);
        f1.assemble();
        f2.assemble();
        expect(v1.equal_position(vr)).toBe(true);
        expect(f1.has_vertex(vr)).toBe(false);
        expect(v1.join_replace(vr)).toBe(true);
        expect(f2.has_vertex(vr)).toBe(false);
        expect(f2.has_vertex(v1)).toBe(true);
        expect(v1.has_face([f1, f2])).toBe(true);
        expect(vr.has_face([f1, f2])).toBe(false);
    });

});