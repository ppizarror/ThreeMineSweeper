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

});