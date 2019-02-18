/* eslint-disable require-jsdoc,no-void,no-unused-expressions,no-extend-native,yoda,no-return-assign,no-var,no-shadow,no-use-before-define */
Array.indexOf || (Array.prototype.indexOf = function (n, h) {
    for (h = h || 0; h < this.length; h++) if (this[h] === n) return h;
    return -1
});
var Parser = function (n) {
    function h(a) {
        function b() {
        }

        b.prototype = a;
        return new b
    }

    function l(a, b, c, f) {
        this.type_ = a;
        this.index_ = b || 0;
        this.prio_ = c || 0;
        this.number_ = void 0 !== f && null !== f ? f : 0;
        this.toString = function () {
            switch (this.type_) {
                case 0:
                    return this.number_;
                case 1:
                case 2:
                case 3:
                    return this.index_;
                case 4:
                    return "CALL";
                default:
                    return "Invalid Token"
            }
        }
    }

    function m(a, b, c, f) {
        this.tokens = a;
        this.ops1 = b;
        this.ops2 = c;
        this.functions = f
    }

    function u(a) {
        return "string" === typeof a ? (p.lastIndex = 0, p.test(a) ? "'" + a.replace(p,
            function (b) {
                var a = v[b];
                return "string" === typeof a ? a : "\\u" + ("0000" + b.charCodeAt(0).toString(16)).slice(-4)
            }) + "'" : "'" + a + "'") : a
    }

    function w(a, b) {
        return Number(a) + Number(b)
    }

    function x(a, b) {
        return a - b
    }

    function y(a, b) {
        return a * b
    }

    function z(a, b) {
        return a / b
    }

    function A(a, b) {
        return a % b
    }

    function B(a, b) {
        return "" + a + b
    }

    function C(a) {
        return -a
    }

    function q(a) {
        return Math.random() * (a || 1)
    }

    function r(a) {
        for (var b = a = Math.floor(a); 1 < a;) b *= --a;
        return b
    }

    function acsc(a) {
        return Math.asin(1 / a);
    }

    function t(a, b) {
        return Math.sqrt(a * a + b * b)
    }

    function D(a, b) {
        if ("[object Array]" !=
            Object.prototype.toString.call(a)) return [a, b];
        a = a.slice();
        a.push(b);
        return a
    }

    function k() {
        this.success = !1;
        this.expression = this.errormsg = "";
        this.tmpprio = this.tokenindex = this.tokenprio = this.tokennumber = this.pos = 0;
        this.ops1 = {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            asin: Math.asin,
            acos: Math.acos,
            atan: Math.atan,
            sqrt: Math.sqrt,
            log: Math.log,
            abs: Math.abs,
            ceil: Math.ceil,
            floor: Math.floor,
            round: Math.round,
            "-": C,
            exp: Math.exp,
            sign: Math.sign,
            acsc: acsc,
        };
        this.ops2 = {"+": w, "-": x, "*": y, "/": z, "%": A, "^": Math.pow, ",": D, "||": B};
        this.functions = {
            random: q,
            fac: r, min: Math.min, max: Math.max, pyt: t, pow: Math.pow, atan2: Math.atan2
        };
        this.consts = {E: Math.E, PI: Math.PI}
    }

    var p = /[\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        v = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "'": "\\'", "\\": "\\\\"};
    m.prototype = {
        simplify: function (a) {
            a = a || {};
            var b = [], c = [], f = this.tokens.length, d;
            for (d = 0; d < f; d++) {
                var e = this.tokens[d];
                var g = e.type_;
                if (0 === g) b.push(e); else if (3 === g && e.index_ in a) e = new l(0,
                    0, 0, a[e.index_]), b.push(e); else if (2 === g && 1 < b.length) {
                    var k = b.pop();
                    g = b.pop();
                    e = this.ops2[e.index_];
                    e = new l(0, 0, 0, e(g.number_, k.number_));
                    b.push(e)
                } else if (1 === g && 0 < b.length) g = b.pop(), e = this.ops1[e.index_], e = new l(0, 0, 0, e(g.number_)), b.push(e); else {
                    for (; 0 < b.length;) c.push(b.shift());
                    c.push(e)
                }
            }
            for (; 0 < b.length;) c.push(b.shift());
            return new m(c, h(this.ops1), h(this.ops2), h(this.functions))
        }, substitute: function (a, b) {
            b instanceof m || (b = (new k).parse(String(b)));
            var c = [], f = this.tokens.length, d;
            for (d = 0; d <
            f; d++) {
                var e = this.tokens[d];
                if (3 === e.type_ && e.index_ === a) for (e = 0; e < b.tokens.length; e++) {
                    var g = b.tokens[e];
                    g = new l(g.type_, g.index_, g.prio_, g.number_);
                    c.push(g)
                } else c.push(e)
            }
            return new m(c, h(this.ops1), h(this.ops2), h(this.functions))
        }, evaluate: function (a) {
            a = a || {};
            var b = [], c = this.tokens.length, f;
            for (f = 0; f < c; f++) {
                var d = this.tokens[f];
                var e = d.type_;
                if (0 === e) b.push(d.number_); else if (2 === e) {
                    var g = b.pop();
                    e = b.pop();
                    d = this.ops2[d.index_];
                    b.push(d(e, g))
                } else if (3 === e) if (d.index_ in a) b.push(a[d.index_]);
                else if (d.index_ in this.functions) b.push(this.functions[d.index_]); else throw Error("undefined variable: " + d.index_); else if (1 === e) e = b.pop(), d = this.ops1[d.index_], b.push(d(e)); else if (4 === e) if (e = b.pop(), d = b.pop(), d.apply && d.call) "[object Array]" == Object.prototype.toString.call(e) ? b.push(d.apply(void 0, e)) : b.push(d.call(void 0, e)); else throw Error(d + " is not a function"); else throw Error("invalid Expression");
            }
            if (1 < b.length) throw Error("invalid Expression (parity)");
            return b[0]
        }, toString: function (a) {
            var b =
                [], c = this.tokens.length, f;
            for (f = 0; f < c; f++) {
                var d = this.tokens[f];
                var e = d.type_;
                if (0 === e) b.push(u(d.number_)); else if (2 === e) {
                    var g = b.pop();
                    e = b.pop();
                    d = d.index_;
                    a && "^" == d ? b.push("Math.pow(" + e + "," + g + ")") : b.push("(" + e + d + g + ")")
                } else if (3 === e) b.push(d.index_); else if (1 === e) e = b.pop(), d = d.index_, "-" === d ? b.push("(" + d + e + ")") : b.push(d + "(" + e + ")"); else if (4 === e) e = b.pop(), d = b.pop(), b.push(d + "(" + e + ")"); else throw Error("invalid Expression");
            }
            if (1 < b.length) throw Error("invalid Expression (parity)");
            return b[0]
        }, variables: function () {
            for (var a =
                this.tokens.length, b = [], c = 0; c < a; c++) {
                var f = this.tokens[c];
                3 === f.type_ && -1 == b.indexOf(f.index_) && b.push(f.index_)
            }
            return b
        }, toJSFunction: function (a, b) {
            return new Function(a, "with(Parser.values) { return " + this.simplify(b).toString(!0) + "; }")
        }
    };
    k.parse = function (a) {
        return (new k).parse(a)
    };
    k.evaluate = function (a, b) {
        return k.parse(a).evaluate(b)
    };
    k.Expression = m;
    k.values = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        sqrt: Math.sqrt,
        log: Math.log,
        abs: Math.abs,
        ceil: Math.ceil,
        floor: Math.floor,
        round: Math.round,
        random: q,
        fac: r,
        exp: Math.exp,
        min: Math.min,
        max: Math.max,
        pyt: t,
        pow: Math.pow,
        atan2: Math.atan2,
        E: Math.E,
        PI: Math.PI,
        sign: Math.sign,
        acsc: acsc,
    };
    k.prototype = {
        parse: function (a) {
            this.errormsg = "";
            this.success = !0;
            var b = [], c = [];
            this.tmpprio = 0;
            var f = 77, d = 0;
            this.expression = a;
            for (this.pos = 0; this.pos < this.expression.length;) this.isOperator() ? this.isSign() && f & 64 ? (this.isNegativeSign() && (this.tokenprio = 2, this.tokenindex = "-", d++, this.addfunc(c, b, 1)), f = 77) : this.isComment() || (0 === (f & 2) && this.error_parsing(this.pos,
                "unexpected operator"), d += 2, this.addfunc(c, b, 2), f = 77) : this.isNumber() ? (0 === (f & 1) && this.error_parsing(this.pos, "unexpected number"), a = new l(0, 0, 0, this.tokennumber), c.push(a), f = 50) : this.isString() ? (0 === (f & 1) && this.error_parsing(this.pos, "unexpected string"), a = new l(0, 0, 0, this.tokennumber), c.push(a), f = 50) : this.isLeftParenth() ? (0 === (f & 8) && this.error_parsing(this.pos, 'unexpected "("'), f & 128 && (d += 2, this.tokenprio = -2, this.tokenindex = -1, this.addfunc(c, b, 4)), f = 333) : this.isRightParenth() ? (f & 256 ? (a = new l(0,
                0, 0, []), c.push(a)) : 0 === (f & 16) && this.error_parsing(this.pos, 'unexpected ")"'), f = 186) : this.isComma() ? (0 === (f & 32) && this.error_parsing(this.pos, 'unexpected ","'), this.addfunc(c, b, 2), d += 2, f = 77) : this.isConst() ? (0 === (f & 1) && this.error_parsing(this.pos, "unexpected constant"), a = new l(0, 0, 0, this.tokennumber), c.push(a), f = 50) : this.isOp2() ? (0 === (f & 4) && this.error_parsing(this.pos, "unexpected function"), this.addfunc(c, b, 2), d += 2, f = 8) : this.isOp1() ? (0 === (f & 4) && this.error_parsing(this.pos, "unexpected function"), this.addfunc(c,
                b, 1), d++, f = 8) : this.isVar() ? (0 === (f & 1) && this.error_parsing(this.pos, "unexpected variable"), a = new l(3, this.tokenindex, 0, 0), c.push(a), f = 186) : this.isWhite() || ("" === this.errormsg ? this.error_parsing(this.pos, "unknown character") : this.error_parsing(this.pos, this.errormsg));
            for ((0 > this.tmpprio || 10 <= this.tmpprio) && this.error_parsing(this.pos, 'unmatched "()"'); 0 < b.length;) a = b.pop(), c.push(a);
            d + 1 !== c.length && this.error_parsing(this.pos, "parity");
            return new m(c, h(this.ops1), h(this.ops2), h(this.functions))
        }, evaluate: function (a,
                               b) {
            return this.parse(a).evaluate(b)
        }, error_parsing: function (a, b) {
            this.success = !1;
            this.errormsg = "parse error [column " + a + "]: " + b;
            throw Error(this.errormsg);
        }, addfunc: function (a, b, c) {
            for (c = new l(c, this.tokenindex, this.tokenprio + this.tmpprio, 0); 0 < b.length;) if (c.prio_ <= b[b.length - 1].prio_) a.push(b.pop()); else break;
            b.push(c)
        }, isNumber: function () {
            for (var a = !1, b = ""; this.pos < this.expression.length;) {
                var c = this.expression.charCodeAt(this.pos);
                if (48 <= c && 57 >= c || 46 === c) b += this.expression.charAt(this.pos), this.pos++,
                    this.tokennumber = parseFloat(b), a = !0; else break
            }
            return a
        }, unescape: function (a, b) {
            for (var c = [], f = !1, d = 0; d < a.length; d++) {
                var e = a.charAt(d);
                if (f) {
                    switch (e) {
                        case "'":
                            c.push("'");
                            break;
                        case "\\":
                            c.push("\\");
                            break;
                        case "/":
                            c.push("/");
                            break;
                        case "b":
                            c.push("\b");
                            break;
                        case "f":
                            c.push("\f");
                            break;
                        case "n":
                            c.push("\n");
                            break;
                        case "r":
                            c.push("\r");
                            break;
                        case "t":
                            c.push("\t");
                            break;
                        case "u":
                            f = parseInt(a.substring(d + 1, d + 5), 16);
                            c.push(String.fromCharCode(f));
                            d += 4;
                            break;
                        default:
                            throw this.error_parsing(b + d, "Illegal escape sequence: '\\" +
                                e + "'");
                    }
                    f = !1
                } else "\\" == e ? f = !0 : c.push(e)
            }
            return c.join("")
        }, isString: function () {
            var a = !1, b = "", c = this.pos;
            if (this.pos < this.expression.length && "'" == this.expression.charAt(this.pos)) for (this.pos++; this.pos < this.expression.length;) if ("'" != this.expression.charAt(this.pos) || "\\" == b.slice(-1)) b += this.expression.charAt(this.pos), this.pos++; else {
                this.pos++;
                this.tokennumber = this.unescape(b, c);
                a = !0;
                break
            }
            return a
        }, isConst: function () {
            var a;
            for (a in this.consts) {
                var b = a.length;
                var c = this.expression.substr(this.pos,
                    b);
                if (a === c) return this.tokennumber = this.consts[a], this.pos += b, !0
            }
            return !1
        }, isOperator: function () {
            var a = this.expression.charCodeAt(this.pos);
            if (43 === a) this.tokenprio = 0, this.tokenindex = "+"; else if (45 === a) this.tokenprio = 0, this.tokenindex = "-"; else if (124 === a) if (124 === this.expression.charCodeAt(this.pos + 1)) this.pos++, this.tokenprio = 0, this.tokenindex = "||"; else return !1; else if (42 === a) this.tokenprio = 1, this.tokenindex = "*"; else if (47 === a) this.tokenprio = 2, this.tokenindex = "/"; else if (37 === a) this.tokenprio =
                2, this.tokenindex = "%"; else if (94 === a) this.tokenprio = 3, this.tokenindex = "^"; else return !1;
            this.pos++;
            return !0
        }, isSign: function () {
            var a = this.expression.charCodeAt(this.pos - 1);
            return 45 === a || 43 === a ? !0 : !1
        }, isPositiveSign: function () {
            return 43 === this.expression.charCodeAt(this.pos - 1) ? !0 : !1
        }, isNegativeSign: function () {
            return 45 === this.expression.charCodeAt(this.pos - 1) ? !0 : !1
        }, isLeftParenth: function () {
            return 40 === this.expression.charCodeAt(this.pos) ? (this.pos++, this.tmpprio += 10, !0) : !1
        }, isRightParenth: function () {
            return 41 ===
            this.expression.charCodeAt(this.pos) ? (this.pos++, this.tmpprio -= 10, !0) : !1
        }, isComma: function () {
            return 44 === this.expression.charCodeAt(this.pos) ? (this.pos++, this.tokenprio = -1, this.tokenindex = ",", !0) : !1
        }, isWhite: function () {
            var a = this.expression.charCodeAt(this.pos);
            return 32 === a || 9 === a || 10 === a || 13 === a ? (this.pos++, !0) : !1
        }, isOp1: function () {
            for (var a = "", b = this.pos; b < this.expression.length; b++) {
                var c = this.expression.charAt(b);
                if (c.toUpperCase() === c.toLowerCase() && (b === this.pos || "_" != c && ("0" > c || "9" < c))) break;
                a += c
            }
            return 0 < a.length && a in this.ops1 ? (this.tokenindex = a, this.tokenprio = 5, this.pos += a.length, !0) : !1
        }, isOp2: function () {
            for (var a = "", b = this.pos; b < this.expression.length; b++) {
                var c = this.expression.charAt(b);
                if (c.toUpperCase() === c.toLowerCase() && (b === this.pos || "_" != c && ("0" > c || "9" < c))) break;
                a += c
            }
            return 0 < a.length && a in this.ops2 ? (this.tokenindex = a, this.tokenprio = 5, this.pos += a.length, !0) : !1
        }, isVar: function () {
            for (var a = "", b = this.pos; b < this.expression.length; b++) {
                var c = this.expression.charAt(b);
                if (c.toUpperCase() ===
                    c.toLowerCase() && (b === this.pos || "_" != c && ("0" > c || "9" < c))) break;
                a += c
            }
            return 0 < a.length ? (this.tokenindex = a, this.tokenprio = 4, this.pos += a.length, !0) : !1
        }, isComment: function () {
            return 47 === this.expression.charCodeAt(this.pos - 1) && 42 === this.expression.charCodeAt(this.pos) ? (this.pos = this.expression.indexOf("*/", this.pos) + 2, 1 === this.pos && (this.pos = this.expression.length), !0) : !1
        }
    };
    return n.Parser = k
}("undefined" === typeof exports ? {} : exports);
