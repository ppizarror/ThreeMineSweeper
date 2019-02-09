describe('Volume test', function () {

    it('Basic pyramid', function () {
        let v1 = new Vertex(0, 0, 0);
        let v2 = new Vertex(3, 0, 0);
        let v3 = new Vertex(1.5, 2, 0);
        let v4 = new Vertex(1.5, 1, 1);

        let f1 = new Face([v1, v4, v2], 'F1');
        let f2 = new Face([v2, v4, v3], 'F2');
        let f3 = new Face([v3, v4, v1], 'F3');
        let f4 = new Face([v1, v3, v2], 'F4');

        let py = new Volume([f1, f2, f3, f4], 'PYRAMID');
        py.set_name(py.get_name() + py.get_id());
        py.has_vertex([v1, v2, v3, v4]);
        py.has_face([f1, f2, f3, f4]);

        // Other checks
        v4.has_face([f1, f2, f3]);
        f4.is_neighbour([f1, f2, f3]);
    });

    it('Test duplicated face removal', function () {
        let v1 = new Vertex(0, 0, 0);
        let v2 = new Vertex(1, 0, 0);
        let v3 = new Vertex(2, 1, 0);
        let v4 = new Vertex(0, 1, 0);
        let verts = [v1, v2, v3, v4];

        let f1 = new Face([v1, v2, v3, v4], 'F1');
        let f2 = new Face([v4, v3, v2, v1], 'F2');
        let f3 = new Face([v2, v1, v4, v3], 'F3');
        let faces = [f1, f2, f3];

        // Adds both faces, then they should be removed
        let vol = new Volume([f1, f2]);
        expect(vol.has_face(f1)).toBe(false);
        expect(vol.has_face(f2)).toBe(false);
        expect(vol.get_faces().length).toBe(0);

        // Adds other faces
        vol.add_face(f2);
        expect(vol.has_face(f2)).toBe(true);
        expect(v1.has_face(f2)).toBe(true);
        expect(v2.has_face(f2)).toBe(true);
        expect(v3.has_face(f2)).toBe(true);
        expect(v4.has_face(f2)).toBe(true);

        vol.add_face(f3); // F3 also contains vertices from F2 so they should be removed
        expect(vol.has_face(f2)).toBe(false);
        expect(vol.has_face(f3)).toBe(false);
        expect(vol.get_faces().length).toBe(0);
        for (let i = 0; i < verts.length; i += 1) {
            for (let j = 0; j < faces.length; j += 1) {
                expect(verts[i].has_face(faces[j])).toBe(false);
            }
        }
    });

});