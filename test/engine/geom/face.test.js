describe('Test face', function () {

    it('Test square face creation', function () {
        let f = new Face();
        let ft = new Face();
        let v1 = new Vertex(0, 0);
        let v2 = new Vertex(0, 1);
        let v3 = new Vertex(1, 1);
        let v4 = new Vertex(1, 0);

        // ID test
        expect(f.get_id !== ft.get_id()).toBe(true);

        // Test vertices cannot be added twice
        expect(f.add_vertex(v1)).toBe(true);
        expect(f.has_vertex(v1)).toBe(true);
        expect(f.add_vertex(v1)).toBe(false);

        expect(f.add_vertex([v2, v3, v4])).toBe(true);
        expect(f.add_vertex([v1, v2, v3, v4])).toBe(false);
        expect(f.length()).toBe(4);
    });

});