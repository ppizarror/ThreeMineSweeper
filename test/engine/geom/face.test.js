describe('Test face', function () {

    it('Test square face creation', function () {
        let f = new Face();
        let ft = new Face();
        let v1 = new Vertex(0, 0);
        let v2 = new Vertex(0, 1);
        let v3 = new Vertex(1, 1);
        let v4 = new Vertex(1, 0);

        // ID test
        f.set_name('F');
        expect(f.get_name()).toBe('F');
        expect(f.get_id !== ft.get_id()).toBe(true);

        // Test vertices cannot be added twice
        expect(f.add_vertex(v1)).toBe(true);
        expect(f.has_vertex(v1)).toBe(true);
        expect(f.add_vertex(v1)).toBe(false);

        expect(f.add_vertex([v2, v3, v4])).toBe(true);
        expect(f.add_vertex([v1, v2, v3, v4])).toBe(false);
        expect(f.length()).toBe(4);
    });

    it('Test normal', function () {
        let f = new Face();
        let v1 = new Vertex(0, 0);
        let v2 = new Vertex(0, 1);
        let v3 = new Vertex(1, 1);
        let v4 = new Vertex(1, 0);
        let v5 = new Vertex(0, 0, -3);

        // Set vertex name
        v1.set_name('A');
        v2.set_name('B');
        v3.set_name('C');
        v4.set_name('D');

        // Test normal
        expect(f.add_vertex([v1, v2, v3, v4])).toBe(true);
        expect(f.is_planar()).toBe(true);

        // Add vertex non planar
        f.add_vertex(v5);
        expect(f.is_planar()).toBe(false);

        // Delete non planar vertex
        f.remove_vertex(v5);
        expect(f.is_planar()).toBe(true);

        // Assert normal
        let n = f.get_normal();
        expect(n.getComponent(0)).toBe(0);
        expect(n.getComponent(1)).toBe(0);
        expect(n.getComponent(2)).toBe(-1);
    });

    it('Test advanced normal', function () {
        let f = new Face();
        let v1 = new Vertex(-1, 2, 5);
        let v2 = new Vertex(0, 1);
        let v3 = new Vertex(1, 1, 6);
        expect(f.add_vertex([v1, v2, v3])).toBe(true);
        let n = f.get_normal();
        expect(n.getComponent(0)).toBe(-6);
        expect(n.getComponent(1)).toBe(-11);
        expect(n.getComponent(2)).toBe(1);
    });

    it('Test ccw', function () {
        let f = new Face();
        let v1 = new Vertex(0, 0);
        let v2 = new Vertex(0, 1);
        let v3 = new Vertex(1, 1);
        let v4 = new Vertex(1, 0);
        f.add_vertex([v1, v2, v3, v4]);
        expect(f.is_ccw()).toBe(true);
        f.remove_vertex([v1, v2, v3, v4]);
        f.add_vertex([v1, v3, v2, v4]);
        expect(f.is_ccw()).toBe(false);
    });

    it('Area/perimeter calculation', function () {
        let f = new Face();
        let v1 = new Vertex(0, 0);
        let v2 = new Vertex(0, 2);
        let v3 = new Vertex(1, 1);
        let v4 = new Vertex(1, 0);
        f.add_vertex([v1, v2, v3, v4]);
        expect(f.is_planar()).toBe(true);
        expect(f.get_area()).toBe(1.5);
        v2.scale(0.5);
        expect(f.get_area()).toBe(1);

        // Scale face
        f.scale(2);
        f.translate(1, 1);
        expect(f.get_area()).toBe(4);

    });

});