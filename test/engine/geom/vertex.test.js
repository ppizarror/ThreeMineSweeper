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

});