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
        f.disable_contour();
        expect(f.has_contour()).toBe(false);
        expect(f.get_neighbours_strlist()).toBe('');
        expect(f.get_name()).toBe('F');
        expect(f.get_id !== ft.get_id()).toBe(true);

        // Test vertices cannot be added twice
        expect(f.add_vertex(v1)).toBe(true);
        expect(f.has_vertex(v1)).toBe(true);
        expect(f.add_vertex(v1)).toBe(false);

        expect(f.add_vertex([v2, v3, v4])).toBe(true);
        expect(f.add_vertex([v1, v2, v3, v4])).toBe(false);
        expect(f.length()).toBe(4);
        expect(f.get_mesh()).toBe(null);
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
        expect(f.get_perimeter()).toBe(4);

        // Scale face
        f.scale(2);
        f.translate(1, 1);
        expect(f.get_area()).toBe(4);
        expect(f.get_perimeter()).toBe(8);
    });

    it('Test multiple vertex and face', function () {
        let f1 = new Face();
        let f2 = new Face();
        let f3 = new Face();
        let f4 = new Face();
        let f5 = new Face();
        let f6 = new Face();
        let f7 = new Face();
        let f8 = new Face();
        let f9 = new Face();
        let v1 = new Vertex(3, 3);
        let v2 = new Vertex(6, 3);
        let v3 = new Vertex(9, 5);
        let v4 = new Vertex(8, 8);
        let v5 = new Vertex(5, 9);
        let v6 = new Vertex(3, 6);
        let v7 = new Vertex(5, 6);
        let v8 = new Vertex(7, 6);
        let v9 = new Vertex(5, 4);
        let v10 = new Vertex(7, 4);

        // Add vertices
        f1.add_vertex([v6, v5, v7]);
        f2.add_vertex([v7, v5, v8]);
        f3.add_vertex([v5, v4, v3, v8]);
        f4.add_vertex([v10, v8, v3]);
        f5.add_vertex([v10, v9, v7, v8]);
        f6.add_vertex([v7, v9, v6]);
        f7.add_vertex([v1, v6, v9, v2]);
        f8.add_vertex([v2, v9, v10]);
        f9.add_vertex([v2, v10, v3]);

        // Assemble figure
        let ff = [f1, f2, f3, f4, f5, f6, f7, f8, f9];
        for (let i = 0; i < ff.length; i += 1) {
            ff[i].assemble();
            expect(ff[i].is_valid()).toBe(true);
        }

        // Test vertex load
        expect(v1.total_faces()).toBe(1);
        expect(v2.total_faces()).toBe(3);
        expect(v3.total_faces()).toBe(3);
        expect(v4.total_faces()).toBe(1);
        expect(v5.total_faces()).toBe(3);
        expect(v6.total_faces()).toBe(3);
        expect(v7.total_faces()).toBe(4);
        expect(v8.total_faces()).toBe(4);
        expect(v9.total_faces()).toBe(4);
        expect(v10.total_faces()).toBe(4);

        // Check neighbours
        expect(f5.get_total_neighbours()).toBe(4);
        expect(f1.is_neighbour([f2, f6], true)).toBe(true);
        expect(f2.is_neighbour([f1, f3, f5], true)).toBe(true);
        expect(f3.is_neighbour([f2, f4], true)).toBe(true);
        expect(f4.is_neighbour([f3, f5, f9], true)).toBe(true);
        expect(f5.is_neighbour([f2, f6, f4, f8], true)).toBe(true);
        expect(f6.is_neighbour([f1, f5, f7], true)).toBe(true);
        expect(f7.is_neighbour([f6, f8], true)).toBe(true);
        expect(f8.is_neighbour([f7, f5, f9], true)).toBe(true);
        expect(f9.is_neighbour([f8, f4], true)).toBe(true);
    });

    it('Test cartesian planar', function () {
        let v1 = new Vertex(0, 0, 0);
        let v2 = new Vertex(0, 1, 0);
        let v3 = new Vertex(1, 1, 0);
        let v4 = new Vertex(0, 0, 1);
        let v5 = new Vertex(0, 1, 1);
        let v6 = new Vertex(1, 0, 0);
        let v7 = new Vertex(1, 0, 1);

        let f1 = new Face([v1, v2, v3]);
        let f2 = new Face([v1, v4, v5]);
        let f3 = new Face([v1, v6, v7]);
        let f4 = new Face([v2, v3, v4]);

        expect(f1.is_cartesian_plane()).toBe(true);
        expect(f2.is_cartesian_plane()).toBe(true);
        expect(f3.is_cartesian_plane()).toBe(true);
        expect(f4.is_cartesian_plane()).toBe(false);
    });

    it('Test rotation', function () {
        let v1 = new Vertex(0, 0, 0);
        let v2 = new Vertex(0, 1, 0);
        let v3 = new Vertex(1, 1, 0);
        let f1 = new Face([v1, v2, v3]);
        let v = [v1, v2, v3];
        expect(f1.has_vertex(v)).toBe(true);
        f1.push_right();
        expect(f1.has_vertex(v)).toBe(true);
        f1.push_left();
        f1.push_left();
        expect(f1.has_vertex(v)).toBe(true);
    });

});