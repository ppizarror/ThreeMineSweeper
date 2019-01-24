describe('Test vertex', function () {
    let v = new Vertex(1, 2, 3);
    let v2 = new Vertex(4, 5, 6);

    it('Test vertex creation', function () {
        expect(v.get_x()).toBe(1);
        expect(v.get_y()).toBe(2);
        expect(v.get_z()).toBe(3);
    });

    it('Test distance', function () {
        expect(v.dist()).toBe(Math.sqrt(14));
        expect(v.dist(v2)).toBe(Math.sqrt(Math.pow(4 - 1, 2) +
            Math.pow(5 - 2, 2) + Math.pow(6 - 3, 2)));
    });

    it('Test sum/subtract', function () {
        let v3 = new Vertex(-1, -2, -3);
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

});