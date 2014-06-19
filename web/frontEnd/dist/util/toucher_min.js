/**
 * @author 剧中人
 * @github https://github.com/bh-lay/toucher
 * @modified 2014-5-25 15:48
 * 
 */
window.util = window.util || {}, window.util.toucher = window.util.toucher || function(a) {
    return new window.util.toucher.init(a);
}, function(a) {
    function b(a, b) {
        var c, d, e;
        for (a = a || "", c = a.split(/\s/g), d = 0, e = c.length; e > d; d++) if (c[d] == b) return !0;
    }
    function c(a, b, c) {
        this._events = this._events || {};
        var d, e;
        return "string" == typeof b ? (d = b.replace(/^\./, ""), e = c) : (d = null, e = b), 
        a.length > 0 && "function" == typeof e && (this._events[a] || (this._events[a] = []), 
        this._events[a].push({
            className: d,
            fn: e
        })), this;
    }
    function d(a, c) {
        var d, e, f, g, h, i, j;
        if (this._events = this._events || {}, this._events[a]) for (d = this._events[a], 
        e = c.target; ;) {
            for (f = d, d = [], g = 0, h = f.length; h > g; g++) if (i = f[g].className, j = f[g].fn, 
            b(e.className, i)) {
                if (0 == j.call(e, c)) return;
            } else d.push(f[g]);
            if (e = e.parentNode, 0 == d.length) return;
            if (e == this.dom || !e) {
                for (g = 0, h = d.length; h > g; g++) i = d[g].className, j = d[g].fn, null == i && j.call(e, c);
                return;
            }
        }
    }
    function e(a, b, c, d) {
        return Math.abs(a - b) >= Math.abs(c - d) ? a - b > 0 ? "Left" : "Right" : c - d > 0 ? "Up" : "Down";
    }
    function f(a) {
        function n() {
            m = !1, clearTimeout(l), clearTimeout(k);
        }
        function o(a) {
            g = a.touches[0].pageX, h = a.touches[0].pageY, i = 0, j = 0, m = !0, c = new Date(), 
            clearTimeout(l), l = setTimeout(function() {
                n(), d.call(b, "longTap", a);
            }, 500);
        }
        function p(a) {
            if (m) {
                var c = new Date();
                c - f > 260 ? k = setTimeout(function() {
                    n(), d.call(b, "singleTap", a);
                }, 250) : (clearTimeout(k), n(), d.call(b, "doubleTap", a)), f = c;
            }
        }
        function q(a) {
            if (d.call(b, "swipe", a), m) {
                if (i = a.touches[0].pageX, j = a.touches[0].pageY, Math.abs(g - i) > 2 || Math.abs(h - j) > 2) {
                    var c = e(g, i, h, j);
                    d.call(b, "swipe" + c, a);
                } else n(), d.call(b, "singleTap", a);
                n(), a.preventDefault(), a.stopPropagation();
            }
        }
        var g, h, i, j, k, l, b = this, c = 0, f = 0, m = !1;
        a.addEventListener("touchstart", o), a.addEventListener("MSPointerDown", o), a.addEventListener("pointerdown", o), 
        a.addEventListener("touchend", p), a.addEventListener("MSPointerUp", p), a.addEventListener("pointerup", p), 
        a.addEventListener("touchmove", q), a.addEventListener("MSPointerMove", q), a.addEventListener("pointermove", q), 
        a.addEventListener("touchcancel", n), a.addEventListener("MSPointerCancel", n), 
        a.addEventListener("pointercancel", n);
    }
    function g(a) {
        this.dom = a, f.call(this, this.dom);
    }
    g.prototype.on = c, a.init = g;
}(util.toucher), window.define && define("util/toucher_min", [], function() {
    return window.util.toucher;
});
