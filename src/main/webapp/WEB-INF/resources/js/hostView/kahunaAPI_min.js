function buildBrowserPush(t, e, n) {
    function i(t) {
        for (var e = "=".repeat((4 - t.length % 4) % 4), n = (t + e).replace(/-/g, "+").replace(/_/g, "/"), i = window.atob(n), r = new Uint8Array(i.length), o = 0; o < i.length; ++o) r[o] = i.charCodeAt(o);
        return r
    }

    function r(t, e, n) {
        return new t.constructor(function(t, i) {
            if (!e) return void i("Active worker not found.");
            var r = new MessageChannel;
            r.port1.onmessage = function(e) {
                if (e.data.error) return i(e.data.error);
                try {
                    t(JSON.parse(e.data))
                } catch (n) {
                    i("Malformed response")
                }
            }, e.postMessage(g + JSON.stringify(n || {}), [r.port2])
        })
    }

    function o(t, e) {
        return new t.constructor(function(n, i) {
            return e.active || i("Error no active registration."), r(t, e.active).then(function(t) {
                return t && t.events ? (t.events.forEach(function(t) {
                    window.Kahuna.trackEventWithOptions(t)
                }), void n(e)) : void i("Unable to register the BrowserPush ServiceWorker")
            })["catch"](function() {
                i("Error sending message to BrowserPush ServiceWorker.")
            })
        })
    }

    function s(t) {
        return window.btoa(JSON.stringify(t))
    }

    function a(t, e, n, i) {
        var r = e && {
                scope: e
            } || void 0,
            a = navigator.serviceWorker.register(t, r);
        return a.then(function(e) {
            return new a.constructor(function(n, i) {
                return e.active ? void n(e) : void(e.onupdatefound = function() {
                    if (e.active) return void n(e);
                    var r = e.installing || e.waiting;
                    r && (r.onstatechange = function(t) {
                        return "activated" === t.target.state ? e.active ? n(e) : i("Controller unavailable") : void 0
                    }), window.setTimeout(function() {
                        navigator.serviceWorker.getRegistration(t).then(function(t) {
                            return t.active ? n(t) : i("5 second timeout reached waiting for ServiceWorker to install.")
                        })
                    }, 5e3)
                })
            })
        }).then(function(t) {
            return o(a, t)
        }).then(function(t) {
            return t.pushManager.getSubscription().then(function(e) {
                return e ? (i(s(e)), t) : (i(null), t.pushManager.subscribe({
                    userVisibleOnly: !0,
                    applicationServerKey: n
                }).then(function(e) {
                    return i(s(e)), window.Kahuna.BrowserPush.subscribe(), t
                }))
            })
        })["catch"](function(t) {
            window.Kahuna.logError(t)
        })
    }

    function u(t, e) {
        navigator.serviceWorker.getRegistrations().then(function(n) {
            n.forEach(function(n) {
                var i = n.active || n.installing || n.waiting,
                    r = i && i.scriptURL;
                if (r) {
                    var o = r.slice(r.length - t.length),
                        s = o === t,
                        a = !e || r.indexOf(e) >= 0;
                    s && a && n.unregister()
                }
            })
        })
    }

    function l() {
        this._isInitialized = !1, this._applicationServerKey = i("BFmh_GGD8yclsABI5K1rdNyfb7kWwSwZ3HDaKXW13ldrriiRDvSy8f3ND5Ry5FA05aFgNCBk0eEFytzCbsJZe1Q")
    }
    if (window.Kahuna.BrowserPush) return window.Kahuna.BrowserPush;
    var g = "[KAHUNA]";
    return l.Status = {
        BLOCKED: "BLOCKED",
        UNAVAILABLE: "UNAVAILABLE",
        GRANTED: "GRANTED",
        ERROR: "ERROR",
        PENDING: "PENDING"
    }, l.prototype.init = function(t, n) {
        if (this._isInitialized) return window.Kahuna.logError("Kahuna.BrowserPush is already initialized."), null;
        this._isInitialized = !0;
        var i = null;
        i = ServiceWorkerRegistration && "showNotification" in ServiceWorkerRegistration.prototype ? "granted" !== Notification.permission && "blocked" !== Notification.permission ? l.Status.PENDING : "granted" === Notification.permission ? l.Status.GRANTED : l.Status.BLOCKED : l.Status.UNAVAILABLE, this._status = i, this._webWorkerUrl = t, this._scope = n, this._controller = null;
        var r = function(t) {
                this._pushToken = t, e(t)
            }.bind(this),
            o = this;
        i === l.Status.PENDING ? this._readyPromise = Notification.requestPermission().then(function(e) {
            return new o._readyPromise.constructor(function(i, r) {
                "granted" !== e ? (o._status = l.Status.BLOCKED, u(t, n), r()) : (o._status = l.Status.GRANTED, i())
            })
        }).then(function() {
            return o._status === l.Status.GRANTED ? a(t, n, o._applicationServerKey, r) : void 0
        }) : i === l.Status.GRANTED ? this._readyPromise = a(t, n, o._applicationServerKey, r) : u(t, n)
    }, l.prototype.isInitialized = function() {
        return this._isInitialized
    }, l.prototype.ready = function(t) {
        return this._isInitialized && this._readyPromise && this._status !== l.Status.ERROR ? void this._readyPromise.then(function() {
            t(!0)
        })["catch"](function() {
            t(!1)
        }) : void t(!1)
    }, l.prototype.flushEvents = function(t) {
        var e = t || function() {};
        if (!this._isInitialized || !this._readyPromise || this._status === l.Status.ERROR) return void e();
        var n = function(t) {
            return o(this._readyPromise, t)
        }.bind(this);
        this._readyPromise.then(n).then(e)["catch"](function() {
            e()
        })
    }, l.prototype.subscribe = function() {
        var t = n();
        this._pushToken && this._pushToken !== t && window.Kahuna.trackEvent("k_push_enabled"), t || e(this._pushToken)
    }, l.prototype.unsubscribe = function() {
        e(null), window.Kahuna.trackEvent("k_push_disabled")
    }, window.Kahuna.BrowserPush || new l
}
if (Array.prototype.includes || (Array.prototype.includes = function(t) {
    "use strict";
    var e = Object(this),
        n = parseInt(e.length, 10) || 0;
    if (0 === n) return !1;
    var i, r = parseInt(arguments[1], 10) || 0;
    r >= 0 ? i = r : (i = n + r, 0 > i && (i = 0));
    for (var o; n > i;) {
        if (o = e[i], t === o || t !== t && o !== o) return !0;
        i++
    }
    return !1
}), function() {
    "use strict"
}(), "undefined" == typeof Kahuna) var Kahuna = function() {
    function t() {
        var t = {
            dev_id: j,
            os_name: B,
            os_version: L,
            dev_name: Y,
            app_name: U,
            app_ver: G,
            sdk_version: q,
            key: O
        };
        return F && (t.push_token = F), t
    }

    function e(t) {
        F = t, t ? document.cookie = "kahuna_push_token=" + t + "; expires=Thu, 2 Aug 3001 20:47:11 UTC; path=/" : document.cookie = "kahuna_push_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;"
    }

    function n(t) {
        for (var e = t + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
            for (var r = n[i];
                 " " == r.charAt(0);) r = r.substring(1, r.length);
            if (0 == r.indexOf(e)) return r.substring(e.length, r.length)
        }
        return null
    }

    function i(t) {
        return t && "string" == typeof t && t.length > 0 ? !0 : !1
    }

    function r() {
        for (var t = 24, e = "abcdefghijklnopqrstuvwxyz0123456789", n = "", i = 0, r = e.length; t > i; ++i) n += e.charAt(Math.floor(Math.random() * r));
        return n
    }

    function o(t) {
        return window.btoa(encodeURIComponent(t))
    }

    function s(t) {
        return decodeURIComponent(window.atob(t))
    }

    function a() {
        try {
            return "sessionStorage" in window && null !== window.sessionStorage
        } catch (t) {
            return !1
        }
    }

    function u(t) {
        var e = new Date;
        t = t || e;
        var n = "" + t.getFullYear(),
            i = "" + (t.getMonth() + 1);
        1 == i.length && (i = "0" + i);
        var r = "" + t.getDate();
        1 == r.length && (r = "0" + r);
        var o = "" + t.getHours();
        1 == o.length && (o = "0" + o);
        var s = "" + t.getMinutes();
        1 == s.length && (s = "0" + s);
        var a = "" + t.getSeconds();
        1 == a.length && (a = "0" + a);
        var u = "" + t.getMilliseconds();
        return u.length < 3 && (u = "0" + u), u.length < 3 && (u = "0" + u), n + "-" + i + "-" + r + " " + o + ":" + s + ":" + a + "." + u
    }

    function l(t) {
        et && ct.log("[Kahuna] [" + u() + "] DEBUG: " + t)
    }

    function g(t) {
        et && ct.log("[Kahuna] [" + u() + "] ERROR: " + t)
    }

    function c(t) {
        try {
            if (null == t || "" === t) return !1;
            var e = p();
            if ("" === e) e = t;
            else {
                if (e.length > 56e3) return !1;
                e = e + "," + t
            }
            var n = JSON.parse("[" + e + "]").length;
            e = o(e), sessionStorage.setItem("kahuna.js.sdk.events", e), l("Events in Queue: " + n + "; maxQueue: " + X.n), n >= X.n && P({
                n: X.n
            })
        } catch (i) {
            return !1
        }
        return !0
    }

    function p() {
        var t = sessionStorage.getItem("kahuna.js.sdk.events");
        return null == t || "" === t ? "" : (t = s(t), "{" != t.charAt(0) || "}" != t.charAt(t.length - 1) ? (h(), "") : t)
    }

    function h() {
        sessionStorage.removeItem("kahuna.js.sdk.events")
    }

    function d() {
        if (!ot) return 0;
        try {
            var t = "kahuna.js.sdk.eventnumber." + j,
                e = Number(localStorage.getItem(t) || 0) + 1;
            return localStorage.setItem(t, e), e
        } catch (n) {
            return 0
        }
    }

    function f() {
        localStorage.removeItem("kahuna.js.sdk.eventnumber." + j)
    }

    function v() {
        X.v ? nt || (nt = setTimeout(function() {
            P({
                t: X.t
            })
        }, 1e3 * X.t * 60)) : P({
            install: (new Date).getTime() / 1e3
        })
    }

    function m(t) {
        it || (it = setTimeout(function() {
            P(t)
        }, 1e3 * X.fsd * 60))
    }

    function P(t) {
        rt && clearTimeout(rt), rt = setTimeout(function() {
            y(t)
        }, 1e3)
    }

    function y(t) {
        var e = t ? JSON.stringify(t) : "";
        l("Flushing Events. Reason: " + e), -1 != e.indexOf("unload") && localStorage.setItem("kahuna.js.sdk.checkInApp", "true"), T();
        var n = p();
        if (lastFlushDate = new Date, "" !== n) {
            h();
            var i;
            i = "[" + n + "]";
            var r = JSON.parse(i),
                o = r.length;
            Math.min(X.b, o);
            o > X.b, l("Flush Reason: " + e + "; Events: " + i);
            var s = N + (t ? (N.indexOf("?") > 0 ? "&" : "?") + "flush_reason=" + encodeURIComponent(e) : "");
            pt.get(s, i, function(e) {
                Kahuna.BrowserPush.flushEvents();
                var i = e.success ? !0 : !1;
                if (!i) {
                    l("Kahuna SDK call failure. Retrying shortly.");
                    var r = p();
                    h(), c(n + (r ? "," : "") + r), P(t)
                }
                if (R(e), "object" == typeof e.sdk_iam && Kahuna.RichInAppMessageManager) {
                    l("Trying to render a Rich IAM");
                    var o = e.sdk_iam;
                    Kahuna.RichInAppMessageManager.handleRichInAppMessageResponse(o)
                } else e.iam_available || "object" == typeof e.sdk_iam ? (l("IAM Available"), I()) : E()
            })
        }
    }

    function I() {
        x({
            callback: function(t) {
                localStorage.removeItem("kahuna.js.sdk.checkInApp");
                try {
                    if ("object" == typeof t.sdk_iam && Kahuna.RichInAppMessageManager) {
                        l("Trying to render a Rich IAM");
                        var e = t.sdk_iam;
                        Kahuna.RichInAppMessageManager.handleRichInAppMessageResponse(e)
                    }
                    if ("undefined" != typeof t.iam) {
                        var n = "",
                            i = null,
                            r = {};
                        for (var o in t.iam) {
                            var s = t.iam[o];
                            "undefined" != typeof s && ("k_m" == o ? n = s : "k_t" == o ? i = s : "k_c" != o && (r[o] = s))
                        }
                        var a = {
                            message: n,
                            expiration: i,
                            additionalParameters: r,
                            read: !1
                        };
                        S(a) && (x({
                            callback: function(t) {},
                            confirmReceipt: !0,
                            inAppTimestamp: i
                        }), E())
                    }
                } catch (u) {
                    g(u.message)
                }
            }
        })
    }

    function b() {
        var t = n("kahuna_in_app_message");
        if (!t || "to_be_delete" === t) return null;
        try {
            return JSON.parse(t)
        } catch (e) {
            return g(e.message), null
        }
    }

    function S(t) {
        if (!t || "undefined" == typeof t.message || "undefined" == typeof t.expiration) return !1;
        var e = b();
        if (e && e.message === t.message && e.expiration === t.expiration) return !0;
        try {
            var n = new Date;
            return n.setDate(n.getDate() + 30), document.cookie = ["kahuna_in_app_message", "=", lt.stringify(t), "; expires=" + n.toUTCString()].join("")
        } catch (i) {
            return g(i.message), null
        }
    }

    function _() {
        var t = b();
        if (!t) return !1;
        t.read = !0;
        try {
            var e = new Date;
            return e.setDate(e.getDate() + 30), document.cookie = ["kahuna_in_app_message", "=", lt.stringify(t), "; expires=" + e.toUTCString()].join("")
        } catch (n) {
            return g(n.message), null
        }
    }

    function k() {
        try {
            var t = new Date;
            return t.setDate(t.getDate() - 30), document.cookie = ["kahuna_in_app_message", "=", "to_be_delete", "; expires=" + t.toUTCString()].join("")
        } catch (e) {
            return g(e.message), !1
        }
    }

    function E() {
        try {
            var t = b();
            if (null !== t && 0 == t.read) {
                var e = new Date,
                    n = new Date;
                if (n.setUTCSeconds(e.expiration), e >= n) return void k();
                var i = {
                    message: t.message,
                    additionalParameters: t.additionalParameters
                };
                "function" == typeof V && V(i)
            }
        } catch (r) {
            return g(r.message), !1
        }
    }

    function T() {
        nt && (clearTimeout(nt), nt = null), it && (clearTimeout(it), it = null)
    }

    function A(t) {
        ot = !!t
    }

    function R(t) {
        t.c && t.c.v && t.c.v !== X.v && (l("Updating configuration from version [" + X.v + "] to version [" + t.c.v + "]"), X = JSON.parse(JSON.stringify(t.c)), nt && (clearTimeout(nt), v()), (!X.b || X.b > X.n) && (X.b = X.n), X.wsd || (X.wsd = J), configurationStr = lt.stringify(X), l(configurationStr), localStorage.setItem("kahuna.js.sdk.configuration", configurationStr))
    }

    function x(t) {
        var e = [];
        e.push("dev_id=" + encodeURIComponent(n("kahuna_dev_id"))), e.push("key=" + O), e.push("env=" + H), e.push("sdk_version=" + q), t.confirmReceipt && t.inAppTimestamp && (e.push("confirm_receipt=true"), e.push("in_app_timestamp=" + t.inAppTimestamp)), pt.fetch(D + "?" + e.join("&"), t.callback)
    }

    function M(t) {}

    function w(t, e) {
        gt[t] || (gt[t] = []), gt[t].push(e), window.addEventListener(t, e), l("Handler registered for " + t)
    }

    function K() {
        for (var t in gt) {
            for (var e = gt[t], n = 0; n < e.length; n++) window.removeEventListener(t, e[n]), l("Handler removed for " + t);
            delete gt[t]
        }
    }
    var C, N = "https://tap-nexus.appspot.com/log",
        D = "https://tap-nexus.appspot.com/iamw",
        O = "",
        B = "",
        L = "",
        U = "",
        G = "",
        j = "",
        Y = "",
        q = "4.0.0",
        F = "",
        Q = !1,
        W = !1,
        z = !1,
        H = "",
        V = null,
        J = 14400,
        X = {
            v: 0,
            t: 30,
            n: 100,
            fsd: 5,
            fi: ["start", "k_user_login", "k_user_logout", "k_app_bg"],
            fs: [],
            wsd: J,
            epmc: 25
        },
        Z = localStorage.getItem("kahuna.js.sdk.configuration");
    if (Z) try {
        X = JSON.parse(Z)
    } catch ($) {}
    var tt = ["sdk_iam"],
        et = !1,
        nt = null,
        it = null,
        rt = null,
        ot = !1,
        st = !1,
        at = !1,
        ut = !1,
        lt = null,
        gt = {};
    "undefined" == typeof JSON || "function" != typeof JSON.stringify ? (lt = {}, lt.stringify = function(t) {
        var e = typeof t;
        if ("object" != e || null === t) return "string" == e && (t = '"' + t + '"'), String(t);
        var n, i, r = [],
            o = t && t.constructor == Array;
        for (n in t) i = t[n], e = typeof i, "string" == e ? i = '"' + i.replace(/"/g, '\\"') + '"' : "object" == e && null !== i && (i = lt.stringify(i)), r.push((o ? "" : '"' + n + '":') + String(i));
        return (o ? "[" : "{") + String(r) + (o ? "]" : "}")
    }) : lt = JSON;
    var ct = {};
    "undefined" == typeof console ? (ct = {}, ct.log = function() {}) : ct = console;
    var pt = function() {
        function e(t) {
            var e = document.createElement("script"),
                n = !1;
            e.src = t, e.async = !0, e.onload = e.onreadystatechange = function() {
                n || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (n = !0, e.onload = e.onreadystatechange = null, e && e.parentNode && e.parentNode.removeChild(e))
            }, l || (l = document.getElementsByTagName("head")[0]), l.appendChild(e)
        }

        function n(t) {
            return encodeURIComponent(t)
        }

        function o(t, e, n) {
            var i = e;
            return p[i] = function(t) {
                "function" == typeof n && n(t);
                try {
                    delete p[i]
                } catch (e) {}
                p[i] = null
            }, this.load(t + '&callback=window["' + i + '"]'), i
        }

        function s(t, e) {
            o.call(this, t, "json" + r(), e)
        }

        function a(e, s, a) {
            g = -1 === (e || "").indexOf("?") ? "?" : "&";
            var u = "json" + r();
            return Kahuna.BrowserPush.ready(function() {
                var r = t();
                r.events = s, r.fsupported = JSON.stringify(tt), ("p" == H || "s" == H) && (r.env = H), i(C) && (r.app_type = C), g += n("client_time") + "=" + n((new Date).getTime() / 1e3) + "&";
                for (c in r) r.hasOwnProperty(c) && (g += n(c) + "=" + n(r[c]) + "&");
                return o.call(this, e + g, u, a)
            }.bind(this)), u
        }

        function u(t) {
            h = t
        }
        var l, g, c, p = this,
            h = {};
        return {
            load: e,
            get: a,
            init: u,
            fetch: s
        }
    }();
    return {
        jsonp: pt,
        init: function(o, s, u, c) {
            try {
                z && (K(), z = !1, O = null, l("UNINIT")), O = o;
                var p = n("kahuna_native_client");
                if (i(p)) {
                    W = !0, p = decodeURIComponent(p);
                    for (var h = [], d = p.split("&"), v = 0; v < d.length; v++) {
                        var m = d[v].split("=");
                        h.push(m[0]), h[m[0]] = m[1]
                    }
                    B = i(h.os_name) ? h.os_name : BrowserDetect.browser, L = i(h.os_version) ? h.os_version : BrowserDetect.version + " (" + BrowserDetect.OS + ")", U = i(h.app_name) ? h.app_name : s, G = i(h.app_ver) ? h.app_ver : u, C = "cookie_injection", Y = i(h.dev_name) ? h.dev_name : "website", i(h.dev_id) && "(null)" !== h.dev_id ? j = h.dev_id : (j = n("kahuna_dev_id"), j || (j = r(), document.cookie = "kahuna_dev_id=" + j + "; expires=Thu, 2 Aug 3001 20:47:11 UTC; path=/", f(), sessionStorage.removeItem("kahuna.js.sdk.creds"), localStorage.removeItem("kahuna.js.sdk.deviceloggedin")))
                } else B = BrowserDetect.browser, L = BrowserDetect.version + " (" + BrowserDetect.OS + ")", U = s, G = u, Y = "website", j = n("kahuna_dev_id"), j || (j = r(), document.cookie = "kahuna_dev_id=" + j + "; expires=Thu, 2 Aug 3001 20:47:11 UTC; path=/", f(), sessionStorage.removeItem("kahuna.js.sdk.creds"), localStorage.removeItem("kahuna.js.sdk.deviceloggedin"));
                F = n("kahuna_push_token"), V = c, E(), Q = a(), w("beforeunload", function() {
                    try {
                        Kahuna.flushEventsNow({
                            fi: "beforeUnload"
                        })
                    } catch (t) {}
                }), localStorage.getItem("kahuna.js.sdk.checkInApp") && setTimeout(function() {
                    Kahuna.checkForInApp()
                }, 5e3), l("REGISTERING EVENT HANDLERS"), this.BrowserPush = buildBrowserPush(t(), e, n.bind(null, "kahuna_push_token")), z = !0
            } catch (P) {
                g(P.message)
            }
        },
        uninit: function() {
            K()
        },
        k: function(t) {
            1 == t && (N = "/log", D = "/iamw")
        },
        setOfflineMode: function(t) {
            ut = t || !1
        },
        callbacks: function() {},
        requireCredentials: function(t, e) {
            st = !!t, e = !!e
        },
        setDebugMode: function(t) {
            et = !!t
        },
        getDebugModeEnabled: function() {
            return et === !0
        },
        enableTriggerCampaigns: function(t) {
            A(!!t)
        },
        getTriggerCampaignsEnabled: function() {
            return ot
        },
        checkForInApp: function() {
            I()
        },
        trackEvent: function(t, e, n) {
            try {
                if (W && "start" === t) return;
                e = e || -1, n = n || -1;
                var i = {};
                i.event = t, e > -1 && n > -1 && (i.count = e, i.value = n), this.trackEventWithOptions(i)
            } catch (r) {
                g(r.message)
            }
        },
        track: function(t) {
            if (t && t.constructor == KahunaEvent) {
                if (W && "start" === eventBuilder.eventName) return;
                var e = t.count || -1,
                    n = t.value || -1,
                    i = {};
                i.event = t.eventName, e > -1 && n > -1 && (i.count = e, i.value = n), t.properties && Object.keys(t.properties).length > 0 && (i.properties = t.getPropertiesAsMap()), this.trackEventWithOptions(i)
            } else g("passed in parameter is null or is not of type KahunaEvent")
        },
        trackEventWithOptions: function(t) {
            try {
                if (z || g("You must call init first."), !t) return void g("You must specify a dictionary of options.");
                var e = t.event || null;
                if (!e || "" == e) return void g("A valid event name in the options dictionary.");
                var n = t.count || -1,
                    i = t.value || -1,
                    r = t.time || (new Date).getTime() / 1e3,
                    o = t.k || "";
                if ("start" == e.toLowerCase()) {
                    var s = (new Date).getTime(),
                        a = new Date(Number(sessionStorage.getItem("kahuna.js.sdk.starteventtime")) || s);
                    if (sessionStorage.setItem("kahuna.js.sdk.starteventtime", s), X.wsd && s - a < 1e3 * X.wsd) return void g("Start event called too frequently. Not sending.")
                }
                var u = "k_app_bg" != e ? d() : 0;
                if (!O || "" === O) return void g("Event not logged. Invalid key.");
                var p = "",
                    h = {};
                h.event = e, h.time = r, u && (h.event_number = u), o && (h.tracking_id = o), t.hasOwnProperty("credentials") && (h.credentials = t.credentials), t.hasOwnProperty("properties") && (h.properties = t.properties), n > -1 && i > -1 ? (h.count = n, h.value = i) : t.hasOwnProperty("user_info") && (h.user_info = t.user_info), p = lt.stringify(h), "k_user_logout" == e ? c(p) : st && !localStorage.getItem("kahuna.js.sdk.deviceloggedin") ? at && F ? c(p) : l("Credentials required. Not sending events.") : "k_app_bg" != e && c(p), -1 != X.fs.indexOf(e.toLowerCase()) ? m({
                    fs: e.toLowerCase()
                }) : -1 != X.fi.indexOf(e.toLowerCase()) && P({
                    fi: e.toLowerCase()
                }), v()
            } catch (f) {
                g(f.message)
            }
        },
        createUserCredentials: function() {
            return new KahunaUserCredentials
        },
        login: function(t) {
            try {
                if (!O || "" === O) return void g("Event not logged. Invalid key. ");
                var e = {};
                if (e.event = "k_user_login", "undefined" != typeof t && !t.isEmpty()) {
                    e.credentials = t.getCredentialsAsMap();
                    var n = (new Date).getTimezoneOffset(),
                        i = Math.abs(n),
                        r = "GMT" + (0 > n ? "+" : "-") + ("00" + Math.floor(i / 60)).slice(-2) + ":" + ("00" + i % 60).slice(-2),
                        o = document.documentElement.lang;
                    o || (o = document.getElementsByTagName("html")[0].getAttribute("lang")), o && (o = o.split("-")[0]), e.user_info = {}, e.user_info.kahuna_tz = r, o && (e.user_info.kahuna_lang = o)
                }
                var s = JSON.stringify(e);
                sessionStorage.getItem("kahuna.js.sdk.creds") != s ? (sessionStorage.setItem("kahuna.js.sdk.creds", s), localStorage.setItem("kahuna.js.sdk.deviceloggedin", "true"), this.trackEventWithOptions(e)) : l("Saved credentials are not modified. Not resending.")
            } catch (a) {
                g(a.message)
            }
        },
        setUserCredentials: function(t, e, n, i, r, o) {
            try {
                if (!O || "" === O) return void g("Event not logged. Invalid key.");
                var s = {};
                t && (s.username = [t]), e && (s.email = [e]), n && (s.fbid = [n]), i && (s.twtr = [i]), r && (s.lnk = [r]), o && (s.user_id = [o]);
                var a = s,
                    u = {};
                u.event = "k_user_credentials", u.credentials = a, this.trackEventWithOptions(u)
            } catch (l) {
                g(l.message)
            }
        },
        setCustomCredentials: function(t) {
            try {
                if (!O || "" === O) return void g("Event not logged. Invalid key.");
                var e = {};
                for (var n in t) t.hasOwnProperty(n) && (e[n] = [t[n]]);
                var i = e,
                    r = {};
                r.event = "k_user_credentials", r.credentials = i, this.trackEventWithOptions(r)
            } catch (o) {
                g(o.message)
            }
        },
        logout: function() {
            try {
                if (sessionStorage.removeItem("kahuna.js.sdk.creds"), localStorage.removeItem("kahuna.js.sdk.deviceloggedin"), !O || "" === O) return void g("Event not logged. Invalid key.");
                var t = {};
                t.event = "k_user_logout", this.trackEventWithOptions(t)
            } catch (e) {
                g(e.message)
            }
        },
        background: function() {
            try {
                if (!O || "" === O) return void g("Event not logged. Invalid key.");
                var t = {};
                t.event = "k_app_bg", Kahuna.trackEventWithOptions(t), this.trackEventWithOptions(t)
            } catch (e) {
                g(e.message)
            }
        },
        setUserAttributes: function(t) {
            try {
                if (!O || "" === O) return void g("Event not logged. Invalid key.");
                if (0 == Object.keys(t).length) return void g("setUserAttributes called with no values.");
                var e = t,
                    n = {};
                n.event = "k_user_attributes", n.user_info = e, this.trackEventWithOptions(n)
            } catch (i) {
                g(i.message)
            }
        },
        clearUserAttributes: function() {
            g("clearUserAttributes() Deprecated")
        },
        setEnvironment: function(t) {
            H = t, "p" == t || "s" == t || g("Environment must be 'p' for Production or 's' for Sandbox")
        },
        getEnvironment: function(t) {
            return H
        },
        setInAppMessageCallBack: function(t) {
            V = t
        },
        dismissInAppMessage: function() {
            _()
        },
        checkInAppMessage: function() {
            E()
        },
        flushEvents: function(t) {
            P(t)
        },
        flushEventsNow: function(t) {
            y(t)
        },
        getLastBatchSentDate: function() {
            return lastFlushDate
        },
        getConfiguration: function() {
            return X
        },
        enableAutomatedCollection: function(t) {
            M(!!t)
        },
        hashChange: function() {
            var t = new KahunaEventBuilder("URL hash changed");
            t.addProperty("url", window.location.href), t.addProperty("baseurl", window.location.href.split("#")[0]), t.addProperty("hash", window.location.hash), Kahuna.track(t.build())
        },
        logDebug: function(t) {
            l(t)
        },
        logError: function(t) {
            g(t)
        },
        updateEventSettings: function(t) {
            R(t)
        }
    }
}();
var KahunaEventBuilder = function(t) {
    this.eventName = t, this.properties = {}, this.count = -1, this.value = -1, this.setPurchaseData = function(t, e) {
        this.count = t, this.value = e
    }, this.addProperty = function(t, e) {
        if (t && e && "string" == typeof t && "string" == typeof e && t.length > 0 && e.length > 0)
            if (0 == t.trim().toLowerCase().indexOf("k_")) logDebug("Warning: key starts with k_ is considered reserved keys.");
            else {
                var n = this.properties[t] || {};
                n[e] = !0, this.properties[t] = n
            }
    }, this.build = function() {
        var t = new KahunaEvent;
        return t.count = this.count, t.value = this.value, t.eventName = this.eventName, t.properties = this.properties, t
    }
};
KahunaEventBuilder.EVENT_PROPERTIES_MAX_COUNT = 25;
var KahunaEvent = function() {
        this.eventName, this.properties = {}, this.count = -1, this.value = -1, this.getPropertiesAsMap = function() {
            if (null != this.properties && Object.keys(this.properties).length > 0) {
                var t = {},
                    e = Kahuna.getConfiguration().epmc || 25;
                for (var n in this.properties)
                    if (this.properties.hasOwnProperty(n) && (t[n] = Object.keys(this.properties[n]), Object.keys(t).length === e)) break;
                return t
            }
        }
    },
    KahunaUserCredentials = function() {
        this.USERNAME_KEY = "username", this.EMAIL_KEY = "email", this.FACEBOOK_KEY = "fbid", this.TWITTER_KEY = "twtr", this.LINKEDIN_KEY = "lnk", this.USER_ID_KEY = "user_id", this.INSTALL_TOKEN_KEY = "install_token", this.GOOGLE_PLUS_ID = "gplus_id", this.credentialsMap = {}, KahunaUserCredentials.prototype.add = function(t, e) {
            if (t && e) {
                var n = this.credentialsMap[t];
                void 0 == n && (n = {}), n[e] = !0, this.credentialsMap[t] = n
            }
        }, KahunaUserCredentials.prototype.getCredentialsAsMap = function() {
            if (null != this.credentialsMap) {
                var t = {};
                for (var e in this.credentialsMap) t[e] = Object.keys(this.credentialsMap[e]);
                return t
            }
        }, KahunaUserCredentials.prototype.isEmpty = function() {
            return 0 == Object.keys(this.credentialsMap).length
        }
    },
    BrowserDetect = {
        init: function() {
            this.browser = this.searchString(this.dataBrowser) || navigator.appName || "unknown browser", this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || navigator.appVersion || "unknown version", this.OS = this.searchString(this.dataOS) || "unknown OS"
        },
        searchString: function(t) {
            for (var e = 0; e < t.length; e++) {
                var n = t[e].string,
                    i = t[e].prop;
                if (this.versionSearchString = t[e].versionSearch || t[e].identity, n) {
                    if (-1 != n.indexOf(t[e].subString)) return t[e].identity
                } else if (i) return t[e].identity
            }
        },
        searchVersion: function(t) {
            var e = t.indexOf(this.versionSearchString);
            if (-1 != e) return parseFloat(t.substring(e + this.versionSearchString.length + 1))
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "CriOS",
            identity: "Chrome",
            versionSearch: "CriOS"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, {
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.userAgent,
            subString: "iPad",
            identity: "iPad"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]
    };
BrowserDetect.init(), window.addEventListener("beforeunload", function() {
    try {
        Kahuna.flushEventsNow({
            fi: "onbeforeunload"
        })
    } catch (t) {}
});
var Color = function() {
    function t(t, e, n, i) {
        return (t << 24) + (e << 16) + (n << 8) + i
    }

    function e(t) {
        try {
            return Number.isInteger(t) ? 0 > t ? !1 : t > 255 ? !1 : !0 : !1
        } catch (e) {
            return !1
        }
    }

    function n(n) {
        if (null == n) return null;
        if ("number" != typeof n.r) return null;
        if ("number" != typeof n.g) return null;
        if ("number" != typeof n.b) return null;
        if ("number" != typeof n.a) return null;
        var i = n.a,
            r = n.r,
            o = n.g,
            s = n.b;
        return e(r) && e(o) && e(s) && e(i) ? t(i, r, o, s) : null
    }

    function i(t) {
        if (null === t) return null;
        if ("number" == typeof t) {
            var e = "",
                n = t >> 16 & 255,
                r = t >> 8 & 255,
                o = 255 & t;
            return e += (15 >= n ? "0" : "") + n.toString(16).toUpperCase(), e += (15 >= r ? "0" : "") + r.toString(16).toUpperCase(), e += (15 >= o ? "0" : "") + o.toString(16).toUpperCase(), "#" + e
        }
        return "object" == typeof t ? i(Color.getIntColorFromColorObject(t)) : void 0
    }
    return {
        getIntColorFromColorObject: function(t) {
            return n(t)
        },
        getRGB: function(t) {
            return i(t)
        },
        argb: function(e, n, i, r) {
            return t(e, n, i, r)
        },
        WHITE: t(255, 255, 255, 255),
        BLACK: t(255, 0, 0, 0),
        RED: t(255, 255, 0, 0),
        GREEN: t(255, 0, 255, 0),
        BLUE: t(255, 0, 0, 255),
        CYAN: t(255, 0, 255, 255),
        DKGRAY: t(255, 68, 68, 68),
        GRAY: t(255, 136, 136, 136),
        LTGRAY: t(255, 204, 204, 204),
        MAGENTA: t(255, 255, 0, 255),
        TRANSPARENT: t(0, 0, 0, 0),
        YELLOW: t(255, 255, 255, 0)
    }
}();
! function() {
    var t = function() {
            function t(t, e) {
                this.text = t ? t : null, this.textColorAsRGB = e ? e : null, this.getText = function() {
                    return this.text
                }, this.getTextColorAsRGB = function() {
                    return this.textColorAsRGB
                }
            }
            return {
                parseRichInAppMessageText: function(e) {
                    if (null !== e && 0 != Object.keys(e).length) {
                        var n = e.text || "";
                        if ("" != n) {
                            var i = "#000000";
                            if ("undefined" != typeof e.color && (i = Color.getRGB(e.color)), null != i) return new t(n, i)
                        }
                    }
                    return Kahuna.logDebug("Invalid Rich In App Text object: " + JSON.stringify(e)), null
                }
            }
        }(),
        e = function() {
            function e(t, e, n, i, r, o, s, a, u, l) {
                this.id = t, this.type = e, this.subtype = n, this.fallbackSubtype = i, this.title = r, this.message = o, this.buttons = s, this.backgroundColorAsInt = a, this.images = u, this.attributes = l, this.getId = function() {
                    return this.id
                }, this.getType = function() {
                    return this.type
                }, this.getSubtype = function() {
                    return this.subtype
                }, this.getFallbackSubtype = function() {
                    return this.fallbackSubtype
                }, this.getTitle = function() {
                    return this.title
                }, this.getMessage = function() {
                    return this.message
                }, this.getBackgroundColorAsInt = function() {
                    return this.backgroundColorAsInt
                }, this.getBackgroundColorAsRGB = function() {
                    return Color.getRGB(this.backgroundColorAsInt)
                }, this.getButtons = function() {
                    return this.buttons
                }, this.getImages = function() {
                    return this.images
                }
            }

            function r(t, r, o, s, a, u, l) {
                this.id = t, this.type = r, this.subtype = o, this.title = s, this.message = a, this.buttons = {};
                var g = Object.keys(u);
                for (var c in g) {
                    var p = g[c];
                    this.buttons[p] = i.parseRichInAppMessageButton(p, u[p])
                }
                this.images = {};
                var h = Object.keys(l);
                for (var c in h) {
                    var d = h[c];
                    this.images[d] = n.parseRichInAppMessageImage(l[d])
                }
                this._fallbackSubtype = null, this._backgroundColorAsInt = Color.WHITE, this.fallbackSubtype = function(t) {
                    return this._fallbackSubtype = t, this
                }, this.backgroundColorAsInt = function(t) {
                    return this._backgroundColorAsInt = t, this
                }, this.build = function() {
                    return new e(this.id, this.type, this.subtype, this._fallbackSubType, this.title, this.message, this.buttons, this._backgroundColorAsInt, this.images, this.attributes)
                }
            }
            return {
                parseRichInAppMessageTemplate: function(e) {
                    var n = null;
                    if ("undefined" != typeof e && null != e) {
                        if ("undefined" == typeof e.templateId || "undefined" == typeof e.type || "undefined" == typeof e.subtype) return null;
                        var i = e.templateId,
                            o = e.type,
                            s = e.subtype;
                        if (null == s && (s = -1), i && o && s >= 0) {
                            var a = e.fallback_subtype;
                            null == a && (a = -1);
                            var u = t.parseRichInAppMessageText(e.title || {}),
                                l = t.parseRichInAppMessageText(e.message || {}),
                                g = Color.WHITE;
                            "undefined" != typeof e.bgcolor && (g = Color.getIntColorFromColorObject(e.bgcolor));
                            var c = (e.attributes, e.images || {});
                            if (null == c) return null;
                            var p = e.buttons || {};
                            if (null == p) return null;
                            null != l && null != g && p && 0 != Object.keys(p).length && (templateBuilder = new r(i, o, s, u, l, p, c), templateBuilder.fallbackSubtype(a), templateBuilder.backgroundColorAsInt(g), n = templateBuilder.build())
                        }
                    }
                    return n
                }
            }
        }(),
        n = function() {
            function t(t) {
                this.url = t, this.getImageUrl = function() {
                    return this.url
                }, this.setBitMap = function(t) {
                    return null
                }, this.getBitMap = function() {
                    return null
                }
            }
            return {
                parseRichInAppMessageImage: function(e) {
                    return e && 0 != Object.keys(e).length && (url = e.url, url) ? new t(url) : null
                }
            }
        }(),
        i = function() {
            function t(t, e, n, i, r, o) {
                this.key = t, this.text = e, this.action = n, this.actionValue = i, this.textColorAsInt = r, this.backgroundColorAsInt = o, this.getKey = function() {
                    return this.key
                }, this.getText = function() {
                    return this.text
                }, this.getAction = function() {
                    return this.action
                }, this.getActionValue = function() {
                    return this.actionValue
                }, this.getTextColorAsInt = function() {
                    return this.textColorAsInt
                }, this.getTextColorAsRGB = function() {
                    return Color.getRGB(this.textColorAsInt)
                }, this.getBackgroundColorAsInt = function() {
                    return this.backgroundColorAsInt
                }, this.getBackgroundColorAsRGB = function() {
                    return Color.getRGB(this.backgroundColorAsInt)
                }
            }
            return {
                parseRichInAppMessageButton: function(e, n) {
                    if (n && Object.keys(n).length > 0 && "string" == typeof n.text) {
                        var i = n.text,
                            r = null,
                            o = null;
                        if (n.action) {
                            var s = n.action;
                            s && Object.keys(s).length > 0 && (void 0 !== s.close ? r = "close" : void 0 !== s.url && (r = "url", o = s.url))
                        }
                        var a = Color.BLACK,
                            u = Color.WHITE;
                        if (void 0 !== n.color && (a = Color.getIntColorFromColorObject(n.color)), void 0 !== n.bgcolor && (u = Color.getIntColorFromColorObject(n.bgcolor)), null != a && null != u && null != r) return new t(e, i, r, o, a, u)
                    }
                    return null
                }
            }
        }(),
        r = function() {
            function t(t, e, i, r) {
                if (this.message = null, this.renderAttempts = 3, this.expireTime = null, this.restrictedCredentials = null, this.state = n.UNPREPARED, this.templates = [], this.trackingId = t, this.templates = e, i > -1) this.expireTime = i;
                else {
                    var s = new Date;
                    s.setSeconds(s.getSeconds() + o.DEFAULT_EXPIRY_SECONDS), this.expireTime = s
                }
                this.restrictedCredentials = r, this.getTrackingId = function() {
                    return this.trackingId
                }, this.getExpireTime = function() {
                    return this.expireTime
                }, this.getRestrictedCredentials = function() {
                    return this.restrictedCredentials
                }, this.getTemplates = function() {
                    return this.templates
                }, this.getRetryAttempts = function() {
                    return this.renderAttempts
                }, this.decrementRetryAttempt = function() {
                    this.renderAttempts--
                }, this.setPreparing = function() {
                    this.state = n.PREPARING
                }, this.setPrepared = function() {
                    this.state = n.PREPARED
                }, this.setUnprepared = function() {
                    this.state = n.PREPARED
                }, this.getState = function() {
                    return this.state
                }
            }
            var n = {
                UNPREPARED: 0,
                PREPARING: 1,
                PREPARED: 2
            };
            return {
                parseRichInAppMessage: function(n) {
                    var i = null;
                    if (n && Object.keys(n).length > 0) {
                        var r = n.trackingId,
                            o = n.expiry || -1,
                            s = n.creds;
                        if (r) {
                            var a = n.templates,
                                u = new Array;
                            if (a && Object.keys(a).length > 0)
                                for (var l = 0; l < a.length; l++) {
                                    var g = a[l],
                                        c = e.parseRichInAppMessageTemplate(g);
                                    if (!c) return null;
                                    u.push(c)
                                }
                            if (!(u.length > 0)) return null;
                            i = new t(r, u, o, s)
                        }
                    }
                    return i
                },
                State: n
            }
        }(),
        o = function() {
            function t() {
                return null == K && (K = o), K
            }

            function e(t) {
                C = t
            }

            function n(e, n) {
                jQuery ? jQuery(document).ready(function(i) {
                    function r() {
                        var r = n.getTemplates(),
                            o = r[0],
                            s = o.getType().toLowerCase(),
                            a = o.getSubtype();
                        g(o, s, a) || (a = o.getFallbackSubtype(), g(o, s, a) || (s = y, a = 1));
                        var u = {
                                button1: {
                                    display: "none"
                                },
                                button2: {
                                    display: "none"
                                },
                                image1: {
                                    display: "none"
                                },
                                image2: {
                                    display: "none"
                                },
                                closeButton: {
                                    display: "none"
                                },
                                title: {
                                    display: "none"
                                },
                                message: {
                                    display: "none"
                                },
                                background: {
                                    display: "none",
                                    "z-index": 99999
                                },
                                backgroundPre: {
                                    opacity: 0
                                },
                                backgroundPost: {
                                    opacity: 1
                                },
                                backgroundClose: {
                                    opacity: 0
                                },
                                modalPanel: {
                                    opacity: .4,
                                    cursor: "not-allowed",
                                    position: "fixed",
                                    left: "0px",
                                    top: "0px",
                                    "background-color": "#000000",
                                    width: i(document).width(),
                                    height: i(document).height()
                                }
                            },
                            l = 500,
                            c = !1;
                        if (_.includes(s)) {
                            p(e, !1), Kahuna.logDebug("Laying out in-app Message: " + s + "--" + a);
                            var d = '"LatoLatinWeb","Lato","AvenirNext-Regular","AvenirNextLTW01-Regular","Avenir Next","Avenir","Segoe UI","Arial","sans-serif"';
                            if (I == s && k.includes(a)) {
                                var f = o.getButtons().button1;
                                f && (u.button1 = {
                                    color: f.getTextColorAsRGB(),
                                    "background-color": f.getBackgroundColorAsRGB(),
                                    width: "154px",
                                    height: "54px",
                                    "line-height": "54px",
                                    "text-align": "center",
                                    "font-family": d,
                                    "font-size": "16px",
                                    border: "none",
                                    "border-radius": "4px",
                                    "box-shadow": "0px 2px 5px 0px rgba(0, 0, 0, 0.5)",
                                    display: "inline-block",
                                    margin: "10px"
                                }), f = o.getButtons().button2, f && (u.button2 = {
                                    color: f.getTextColorAsRGB(),
                                    "background-color": f.getBackgroundColorAsRGB(),
                                    width: "154px",
                                    height: "54px",
                                    "line-height": "54px",
                                    "text-align": "center",
                                    "font-family": d,
                                    "font-size": "16px",
                                    border: "none",
                                    "border-radius": "4px",
                                    "box-shadow": "0px 2px 5px 0px rgba(0, 0, 0, 0.5)",
                                    display: "inline-block",
                                    margin: "10px"
                                }), o.getImages().image1 && (u.image1 = {
                                    width: "100%",
                                    padding: "0px",
                                    margin: "0px",
                                    "line-height": "0px"
                                }), o.getImages().image2 && (u.image2 = {
                                    width: "100%",
                                    padding: "0px",
                                    margin: "0px",
                                    "line-height": "0px"
                                }), u.title = {
                                    color: o.getTitle().getTextColorAsRGB(),
                                    padding: "10px",
                                    "font-size": "24px",
                                    "font-family": d,
                                    "text-align": "center"
                                }, u.message = {
                                    color: o.getMessage().getTextColorAsRGB(),
                                    padding: "10px",
                                    "padding-left": "30px",
                                    "padding-right": "30px;",
                                    "font-size": "13px",
                                    "text-align": "left",
                                    "font-family": d
                                }, u.background = {
                                    "background-color": o.getBackgroundColorAsRGB(),
                                    padding: "0px",
                                    width: "360px",
                                    position: "fixed",
                                    top: "30px",
                                    border: "1px solid darkgray",
                                    left: (i(window).width() - 480) / 2 + "px",
                                    "box-shadow": "0px 5px 5px 0px rgba(0, 0, 0, 0.5)",
                                    "z-index": 99999,
                                    cursor: "default"
                                }, c = !0
                            } else if (b == s && E.includes(a) || y == s) {
                                Kahuna.logDebug(JSON.stringify(o));
                                var f = o.getButtons().button1;
                                f && (u.button1 = {
                                    "background-color": f.getBackgroundColorAsRGB(),
                                    color: f.getTextColorAsRGB(),
                                    "border-collapse": "collapse",
                                    "border-top": "1px solid #545e6b",
                                    width: "147px",
                                    height: "53px",
                                    "line-height": "53px",
                                    "font-size": "16px",
                                    "text-align": "center",
                                    "font-family": d,
                                    display: "inline-block",
                                    margin: "0px"
                                }), f = o.getButtons().button2, f && (u.button2 = {
                                    "background-color": f.getBackgroundColorAsRGB(),
                                    color: f.getTextColorAsRGB(),
                                    "border-collapse": "collapse",
                                    "border-top": "1px solid #545e6b",
                                    "border-left": "1px solid #545e6b",
                                    width: "147px",
                                    height: "53px",
                                    "line-height": "53px",
                                    "font-size": "16px",
                                    "text-align": "center",
                                    "font-family": d,
                                    display: "inline-block",
                                    margin: "0px"
                                }), o.getImages().image1 && (u.image1 = {
                                    width: "100%",
                                    padding: "0px",
                                    margin: "0px",
                                    "line-height": "0px"
                                }), o.getImages().image1 && (u.image2 = u.image1), u.title = {
                                    color: o.getTitle().getTextColorAsRGB(),
                                    "text-align": "center",
                                    padding: "10px",
                                    "font-size": "x-large",
                                    "font-family": d
                                }, u.message = {
                                    color: o.getMessage().getTextColorAsRGB(),
                                    padding: "12px",
                                    "padding-left": "30px",
                                    "padding-right": "30px",
                                    "font-size": "13px",
                                    "text-align": "left",
                                    "font-family": d,
                                    "min-height": "72px"
                                }, u.background = {
                                    padding: "0px",
                                    "background-color": o.getBackgroundColorAsRGB(),
                                    width: "296px",
                                    position: "fixed",
                                    top: "30px",
                                    border: "1px solid #666666",
                                    "box-shadow": "0px 5px 5px 0px rgba(0, 0, 0, 0.5)",
                                    left: (i(window).width() - 296) / 2 + "px",
                                    "z-index": 99999,
                                    cursor: "default"
                                }, c = !0
                            } else if (S == s && T.includes(a)) u.button1 = {
                                color: o.getMessage().getTextColorAsRGB(),
                                top: "0px",
                                left: "0px",
                                width: "100%",
                                height: "100%",
                                "min-height": "60px",
                                position: "absolute",
                                padding: "12px",
                                "font-size": "normal",
                                "text-align": "left",
                                "font-family": d
                            }, u.button2 = {
                                display: "none"
                            }, u.image1 = {
                                width: "60px",
                                height: "60px",
                                position: "absolute",
                                left: "13px",
                                top: "13px"
                            }, u.image2 = {
                                display: "none"
                            }, u.close_button = {
                                width: "16px",
                                height: "16px",
                                "vertical-align": "top",
                                align: "right",
                                position: "absolute",
                                right: "3px",
                                top: "3px",
                                "font-weight": "bold",
                                color: o.getButtons().close_button.getTextColorAsRGB()
                            }, u.title = {
                                display: "none"
                            }, u.message = {
                                color: o.getMessage().getTextColorAsRGB(),
                                bottom: "0px",
                                "min-height": "60px",
                                position: "relative",
                                "padding-top": "32px",
                                padding: "24px",
                                "padding-left": "99px",
                                "font-size": "13px",
                                "text-align": "left",
                                "font-family": d
                            }, u.background = {
                                padding: "0px",
                                "background-color": o.getButtons().button1.getBackgroundColorAsRGB(),
                                position: "fixed",
                                bottom: "10px",
                                right: "10px",
                                width: "360px",
                                "min-height": "86px",
                                "box-shadow": "0px 5px 5px 0px rgba(0, 0, 0, 0.5)",
                                "z-index": 99999,
                                cursor: "default"
                            }, u.backgroundPre = {
                                bottom: "-400px"
                            }, u.backgroundPost = {
                                bottom: "10px"
                            }, u.backgroundClose = {
                                opacity: 0
                            }, c = !1;
                            else {
                                var f = o.getButtons().button1;
                                f && (u.button1 = {
                                    "background-color": f.getBackgroundColorAsRGB(),
                                    color: f.getTextColorAsRGB(),
                                    "border-collapse": "collapse",
                                    border: "1px solid #545e6b",
                                    "border-left": "1px solid #545e6b",
                                    width: "99%",
                                    height: "42px",
                                    "line-height": "34px",
                                    padding: "3px",
                                    "font-size": "16px",
                                    "text-align": "center",
                                    "font-family": d
                                }), f = o.getButtons().button2, f && (u.button2 = u.button1), o.getImages().image1 && (u.image1 = {
                                    width: "100%",
                                    padding: "0px",
                                    margin: "0px",
                                    "line-height": "0px"
                                }), o.getImages().image1 && (u.image2 = u.image1), u.title = {
                                    color: o.getTitle().getTextColorAsRGB(),
                                    padding: "10px",
                                    "font-size": "x-large",
                                    "font-family": d
                                }, u.message = {
                                    color: o.getMessage().getTextColorAsRGB(),
                                    padding: "10px",
                                    "font-size": "normal",
                                    "text-align": "left",
                                    "font-family": d
                                }, u.background = {
                                    padding: "0px",
                                    "background-color": o.getBackgroundColorAsRGB(),
                                    "z-index": 99999
                                }
                            }
                        }
                        var m = i("<div />", {}),
                            A = i("<div />").css(u.modalPanel),
                            M = function() {
                                A.css({
                                    width: i(document).width(),
                                    height: i(document).height()
                                })
                            };
                        i(window).bind("resize", M), c && (i("body").append(A), A.css({
                            "z-index": 99998
                        }), A.animate(u.modalPanel, 500));
                        var w = function() {
                                i("body").unbind("resize", M), m.remove(), A.remove(), v("hide", !0, "In-app Dialog is Closing")
                            },
                            K = function(t) {
                                A.animate(u.backgroundClose, 500), m.animate(u.backgroundClose, 500, w), t && h(t, o.getButtons()), console.log("SUCCESS")
                            };
                        m.css(u.background);
                        o.getImages().image1 && m.append(i("<img />", {
                            src: o.getImages().image1.getImageUrl()
                        }).css(u.image1)), o.getImages().image2 && m.append(i("<img />", {
                            src: o.getImages().image2.getImageUrl()
                        }).css(u.image2)), o.getTitle() && m.append(i("<div />", {
                            text: o.getTitle().getText()
                        }).css(u.title)), o.getMessage().getText() && m.append(i("<div />", {
                            text: o.getMessage().getText()
                        }).css(u.message)), o.getButtons().button1 && m.append(i("<div />", {
                            text: o.getButtons().button1.getText()
                        }).css(u.button1).on("click", function() {
                            K("button1")
                        })), o.getButtons().button2 && m.append(i("<div />", {
                            text: o.getButtons().button2.getText()
                        }).css(u.button2).on("click", function() {
                            K("button2")
                        })), o.getButtons().close_button && m.append(i("<div />", {
                            html: "&times;"
                        }).css(u.close_button).on("click", function() {
                            K("close_button")
                        })), m.css(u.backgroundPre);
                        var C = new KahunaEventBuilder("k_iam_displayed");
                        C.addProperty(R, t().mLastInAppMessageReceived.getTrackingId()), C.addProperty(x, o.getId()), Kahuna.track(C.build()), i("body").append(m), m.animate(u.backgroundPost, l), m.animate(u.backgroundPost, l), v("show", !0, "In-app is Showing"), P = {
                            hide: w
                        }
                    }
                    return n.getRetryAttempts() <= 0 ? void(t().mLastInAppMessageReceived == n && (t().mLastInAppMessageReceived = null)) : (n.decrementRetryAttempt(), void r())
                }) : logError("jQuery is needed to display Kahuna Marketer-Driven In-app Messages.")
            }

            function i(e, n) {
                if (!e || 0 == Object.keys(e).length) return void(Kahuna.getDebugModeEnabled() && Kahuna.logDebug("Aborting attempt to process empty or null in app message " + e));
                if (Kahuna.logDebug("Processing received Rich In App Message: " + JSON.stringify(e)), e)
                    if (message = r.parseRichInAppMessage(e), message && l(message)) {
                        if (null != t().mLastInAppMessageReceived) return Kahuna.logDebug("Already processing another in app message, closing the old and opening the new."), p(t().foregroundActivity, !1), t().mLastInAppMessageReceived = null, void i(e, n);
                        t().mLastInAppMessageReceived = message, u(message, t().foregroundActivity), "function" == typeof n && (Kahuna.logDebug("Calling callback"), n())
                    } else Kahuna.logDebug("Unable to display Rich In App Message with missing or malformed data."), d(message, "Missing or Malformed data.")
            }

            function s(e) {
                Kahuna.logDebug("hostActivityStarted"), null != t().activityRenderedOn && (p(t().activityRenderedOn, !1), t().activityRenderedOn = null), null != t().mLastInAppMessageReceived && u(t().mLastInAppMessageReceived, e), t().foregroundActivity = e
            }

            function a(e) {
                t().activityRenderedOn == e && p(e, !1), t().foregroundActivity == e && (t().foregroundActivity = null)
            }

            function u(e, n) {
                null != e && (e.getState() == r.State.UNPREPARED ? (e.setPreparing(), c(e)) : e.getState() == r.State.PREPARED && null != n && t().renderInAppMessage(n, e))
            }

            function l(t) {
                if (null == t || 0 == Object.keys(t.getTemplates()).length) return !1;
                var e = new Date / 1e3,
                    n = t.getExpireTime();
                if (n > 0 && e > n) return Kahuna.getDebugModeEnabled() && Kahuna.logDebug("Unable to display expired Rich In App Message."), d(t, "Message expired."), !1;
                if (null != t.getRestrictedCredentials() && !KahunaUtils.getHaveCredentialsInRestrictionMap(t.getRestrictedCredentials())) return d(t, "Bad credentials."), !1;
                for (var i = t.getTemplates(), r = 0; r < i.length; r++) {
                    var o = i[r];
                    if (o && !g(o, o.getType(), o.getSubtype()) && !g(o, o.getType(), o.getFallbackSubtype()) && !g(o, y, 1)) return Kahuna.getDebugModeEnabled() && Kahuna.logDebug("Unable to display Rich In App Message with missing or malformed data."), d(t, "Missing or Malformed data."), !1
                }
                return !0
            }

            function g(t, e, n) {
                if (null == t || "" == e || !_.includes(e)) return !1;
                if (I == e) {
                    if (!k.includes(n)) return !1;
                    if (!t.getTitle() || !t.getMessage() || 0 == Object.keys(t.getImages()).length || 0 == Object.keys(t.getButtons()).length) return !1;
                    if (!t.getButtons().button1 || !t.getButtons().button2) return !1;
                    switch (n) {
                        case 1:
                            if (!t.getImages().image1) return !1;
                            break;
                        case 2:
                            if (!t.getImages().image1 || !t.getImages().image2) return !1;
                            break;
                        default:
                            return !1
                    }
                } else if (b == e) {
                    if (!E.includes(n)) return !1;
                    if (!t.getTitle() || !t.getMessage() || 0 == Object.keys(t.getImages()).length || 0 == Object.keys(t.getButtons()).length) return !1;
                    if (!t.getImages().image1) return !1;
                    switch (n) {
                        case 1:
                            if (!t.getButtons().button1 || !t.getButtons().button2) return !1;
                            break;
                        default:
                            return !1
                    }
                } else if (S == e) {
                    if (!T.includes(n)) return !1;
                    if (!t.getMessage() || 0 == Object.keys(t.getImages()).length || 0 == Object.keys(t.getButtons()).length) return !1;
                    if (!t.getImages().image1) return !1;
                    if (null == t.getButtons().button1 || null == t.getButtons().close_button) return !1
                } else {
                    if (!t.getMessage() || 0 == Object.keys(t.getButtons()).length) return !1;
                    if (!t.getButtons().button1) return !1
                }
                return !0
            }

            function c(e) {
                var n;
                this.inAppMessage = e, n = e, n.setPrepared(), null != t().foregroundActivity ? t().renderInAppMessage(t().foregroundActivity, n) : (n.setUnprepared(), d(n, "Failed to download images."), t().mLastInAppMessageReceived == n && (t().mLastInAppMessageReceived = null))
            }

            function p(e, n) {
                if (null != e && null != P) {
                    try {
                        P.hide()
                    } catch (i) {
                        Kahuna.logError("Caught exception dismissing In App Message dialog: " + i.message)
                    }
                    P = null, n && (t().mLastInAppMessageReceived = null)
                }
            }

            function h(e, n) {
                try {
                    var i = n[e];
                    if (null != i) {
                        var r = i.getAction();
                        if (r && Object.keys(r).length > 0 && "url" == r) {
                            var o = i.getActionValue();
                            if (o) {
                                window.open(o)
                            }
                        }
                        if (null != t().mLastInAppMessageReceived && t().mLastInAppMessageReceived.getTemplates().length > 0) {
                            Kahuna.logDebug("Button Clicked");
                            var s = t().mLastInAppMessageReceived.getTemplates()[0],
                                a = new KahunaEventBuilder("k_iam_clicked");
                            a.addProperty("trackingId", t().mLastInAppMessageReceived.getTrackingId()), a.addProperty("templateId", s.getId()), a.addProperty("button", e), Kahuna.track(a.build()), Kahuna.flushEvents({
                                fi: "k_iam_clicked"
                            })
                        }
                    }
                } catch (u) {
                    Kahuna.logDebug("Caught exception trying to open Url: " + u.message)
                }
                p(t().foregroundActivity, !0)
            }

            function d(t, e) {
                var n = new KahunaEventBuilder("k_iam_not_displayed");
                if (n.addProperty(w, e), t && (n.addProperty(R, t.getTrackingId()), t.getTemplates().length > 0)) {
                    var i = t.getTemplates()[0];
                    n.addProperty(x, i.getId())
                }
                Kahuna.track(n.build())
            }

            function f(t, e) {
                var n = ["show", "click", "hide"];
                return n.includes(t) ? "function" != typeof e ? (logDebug("Invalid Event Handler Callback"), !1) : (N[t].push(e), Kahuna.logDebug("registering event handler to " + t), !0) : (logDebug("Invalid Event Handler Type"), !1)
            }

            function v(t, e, n) {
                var i = N[t];
                for (var r in i) i[r](t, e, n)
            }

            function m() {
                N = {
                    show: [],
                    hide: [],
                    click: []
                }
            }
            var P, y = "system",
                I = "fullscreen",
                b = "modal",
                S = "slider",
                _ = [y, I, b, S],
                k = [1, 2],
                E = [1],
                T = [1],
                A = 86400,
                R = "trackingId",
                x = "templateId",
                M = "button",
                w = "reason",
                K = null,
                C = null,
                N = {
                    show: [],
                    hide: [],
                    click: []
                };
            return {
                DEFAULT_EXPIRY_SECONDS: A,
                TRACKINGID_PROPERTY_KEY: R,
                TEMPLATEID_PROPERTY_KEY: x,
                BUTTON_PROPERTY_KEY: M,
                REASON_PROPERTY_KEY: w,
                setContext: function(t) {
                    e(t)
                },
                handleRichInAppMessageResponse: function(t) {
                    return i(t)
                },
                renderInAppMessage: function(t, e) {
                    return n(t, e)
                },
                closeInAppMessage: function() {
                    return p(t().foregroundActivity, !0)
                },
                hostActivityStarted: function(t) {
                    s(t)
                },
                hostActivityStopped: function(t) {
                    a(t)
                },
                addEventHandler: function(t, e) {
                    f(t, e)
                },
                clearEventHandlers: function() {
                    m()
                }
            }
        }();
    Kahuna.RichInAppMessage = r, Kahuna.RichInAppMessageButton = i, Kahuna.RichInAppMessageText = t, Kahuna.RichInAppMessageImage = n, Kahuna.RichInAppMessageTemplate = e, Kahuna.RichInAppMessageManager = o, Kahuna.RichInAppMessageManager.hostActivityStarted(window)
}();
var KahunaMP = function() {
    function t(t) {
        if (Kahuna.logError(t), "s" == Kahuna.getEnvironment()) throw t
    }

    function e(e) {
        var n = new KahunaEventBuilder(e);
        return n.setRequiredProperties = function(t) {
            this.requiredProperties = t
        }, n.setRequiredProperties([]), n.superBuild = n.build, n.build = function() {
            for (var e in this.requiredProperties)
                if (!this.properties[this.requiredProperties[e]]) return t("Missing required property: " + this.requiredProperties[e]), null;
            return this.superBuild()
        }, n.setProperty = function(t, e) {
            delete this.properties[t], this.addProperty(t, e)
        }, n
    }

    function n(n, i, r, o, s) {
        var a = new e(KahunaMP.Events.ADD_LISTING),
            u = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.CATEGORY, KahunaMP.Props.TITLE, KahunaMP.Props.PRICE, KahunaMP.Props.QUANTITY];
        return a.setRequiredProperties(u), a.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, a.setSKU = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SKU, t.toString()) : null, this
        }, a.addCategory = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.CATEGORY, t.toString()) : null, this
        }, a.setTitle = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.TITLE, t.toString()) : null, this
        }, a.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, a.setRevenuePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setRevenuePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.REVENUE, e.toString(10)) : null, this
        }, a.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, a.addSubcategory = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.SUBCATEGORY, t.toString()) : null, this
        }, a.setSubtitle = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SUBTITLE, t.toString()) : null, this
        }, a.setDescription = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.DESCRIPTION, t.toString()) : null, this
        }, a.addBuyType = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.BUY_TYPE, t.toString()) : null, this
        }, a.setExpiration = function(e) {
            return "object" != typeof e ? t("setExpiration requires a date value") : "function" != typeof e.toISOString ? t("setExpiration requires a date value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.EXPIRATION, e.toISOString().replace(/\..*Z/, "")) : null, this
        }, a.setShippingPrice = function(e) {
            return "number" != typeof e || 0 > e ? t("setShippingPrice requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.SHIPPING_PRICE, e.toString(10)) : null, this
        }, a.setShippingType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SHIPPING_TYPE, t.toString()) : null, this
        }, a.setLocation = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LOCATION, t.toString()) : null, this
        }, a.setListingID(n), arguments.length == u.length && (a.addCategory(i), a.setTitle(r), a.setPricePerUnit(o), a.setQuantity(s)), a
    }

    function i(n, i, r, o, s) {
        var a = new e(KahunaMP.Events.EDIT_LISTING),
            u = [KahunaMP.Props.LISTING_ID];
        return a.setRequiredProperties(u), a.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, a.setSKU = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SKU, t.toString()) : null, this
        }, a.addCategory = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.CATEGORY, t.toString()) : null, this
        }, a.setTitle = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.TITLE, t.toString()) : null, this
        }, a.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, a.setRevenuePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setRevenuePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.REVENUE, e.toString(10)) : null, this
        }, a.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, a.addSubcategory = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.SUBCATEGORY, t.toString()) : null, this
        }, a.setSubtitle = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SUBTITLE, t.toString()) : null, this
        }, a.setDescription = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.DESCRIPTION, t.toString()) : null, this
        }, a.addBuyType = function(t) {
            return void 0 !== t && null != t ? this.addProperty(KahunaMP.Props.BUY_TYPE, t.toString()) : null, this
        }, a.setExpiration = function(e) {
            return "object" != typeof e ? t("setExpiration requires a date value") : "function" != typeof e.toISOString ? t("setExpiration requires a date value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.EXPIRATION, e.toISOString().replace(/\..*Z/, "")) : null, this
        }, a.setShippingPrice = function(e) {
            return "number" != typeof e || 0 > e ? t("setShippingPrice requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.SHIPPING_PRICE, e.toString(10)) : null, this
        }, a.setShippingType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SHIPPING_TYPE, t.toString()) : null, this
        }, a.setLocation = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LOCATION, t.toString()) : null, this
        }, a.setListingID(n), 5 == arguments.length && (a.addCategory(i), a.setTitle(r), a.setPricePerUnit(o), a.setQuantity(s)), a
    }

    function r(t, n) {
        var i = new e(KahunaMP.Events.REMOVE_LISTING),
            r = [KahunaMP.Props.LISTING_ID];
        return i.setRequiredProperties(r), i.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, i.setReason = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.REASON, t.toString()) : null, this
        }, i.setListingID(t), arguments.length == r.length, i
    }

    function o(n, i, r, o) {
        var s = new e(KahunaMP.Events.PURCHASE_LISTING),
            a = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.TRANSACTION_ID, KahunaMP.Props.PRICE, KahunaMP.Props.QUANTITY];
        return s.setRequiredProperties(a), s.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, s.setTransactionID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.TRANSACTION_ID, t.toString()) : null, this
        }, s.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, s.setRevenuePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setRevenuePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.REVENUE, e.toString(10)) : null, this
        }, s.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, s.setOfferID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.OFFER_ID, t.toString()) : null, this
        }, s.setBidID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.BID_ID, t.toString()) : null, this
        }, s.setBuyType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.BUY_TYPE, t.toString()) : null, this
        }, s.setShippingPrice = function(e) {
            return "number" != typeof e || 0 > e ? t("setShippingPrice requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.SHIPPING_PRICE, e.toString(10)) : null, this
        }, s.setShippingType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SHIPPING_TYPE, t.toString()) : null, this
        }, s.setListingID(n), arguments.length == a.length && (s.setTransactionID(i), s.setPricePerUnit(r), s.setQuantity(o)), s
    }

    function s(n, i, r, o) {
        var s = new e(KahunaMP.Events.MAKE_OFFER_LISTING),
            a = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.PRICE, KahunaMP.Props.QUANTITY, KahunaMP.Props.OFFER_ID];
        return s.setRequiredProperties(a), s.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, s.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, s.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, s.setOfferID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.OFFER_ID, t.toString()) : null, this
        }, s.setListingID(n), arguments.length == a.length && (s.setPricePerUnit(r), s.setQuantity(o), s.setOfferID(i)), s
    }

    function a(n, i, r, o) {
        var s = new e(KahunaMP.Events.BID_LISTING),
            a = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.BID_ID, KahunaMP.Props.PRICE, KahunaMP.Props.QUANTITY];
        return s.setRequiredProperties(a), s.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, s.setBidID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.BID_ID, t.toString()) : null, this
        }, s.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, s.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, s.setListingID(n), arguments.length == a.length && (s.setBidID(i), s.setPricePerUnit(r), s.setQuantity(o)), s
    }

    function u(n, i, r) {
        var o = new e(KahunaMP.Events.ADD_TO_CART_LISTING),
            s = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.PRICE, KahunaMP.Props.QUANTITY];
        return o.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, o.setPricePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setPricePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.PRICE, e.toString(10)) : null, this
        }, o.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, o.setBuyType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.BUY_TYPE, t.toString()) : null, this
        }, o.setRevenuePerUnit = function(e) {
            return "number" != typeof e || 0 > e ? t("setRevenuePerUnit requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.REVENUE, e.toString(10)) : null, this
        }, o.setShippingPrice = function(e) {
            return "number" != typeof e || 0 > e ? t("setShippingPrice requires a non-negative numeric value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.SHIPPING_PRICE, e.toString(10)) : null, this
        }, o.setShippingType = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.SHIPPING_TYPE, t.toString()) : null, this
        }, o.setListingID(n), arguments.length == s.length && (o.setPricePerUnit(i), o.setQuantity(r)), o
    }

    function l(n, i) {
        var r = new e(KahunaMP.Events.REMOVE_FROM_CART_LISTING),
            o = [KahunaMP.Props.LISTING_ID, KahunaMP.Props.QUANTITY];
        return r.setRequiredProperties(o), r.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, r.setQuantity = function(e) {
            return "number" != typeof e || !Number.isInteger(e) || 0 > e ? t("setQuantity requires a non-negative integer value") : void 0 !== e && null != e ? this.setProperty(KahunaMP.Props.QUANTITY, e.toString(10)) : null, this
        }, r.setListingID(n), arguments.length == o.length && r.setQuantity(i), r
    }

    function g(t) {
        var n = new e(KahunaMP.Events.VIEW_LISTING),
            i = [KahunaMP.Props.LISTING_ID];
        return n.setRequiredProperties(i), n.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, n.setListingID(t), n
    }

    function c(t) {
        var n = new e(KahunaMP.Events.WATCH_LISTING),
            i = [KahunaMP.Props.LISTING_ID];
        return n.setRequiredProperties(i), n.setListingID = function(t) {
            return void 0 !== t && null != t ? this.setProperty(KahunaMP.Props.LISTING_ID, t.toString()) : null, this
        }, n.setListingID(t), n
    }
    return {
        AddListingEventBuilder: function() {
            return n.apply(this, arguments)
        },
        EditListingEventBuilder: function() {
            return i.apply(this, arguments)
        },
        RemoveListingEventBuilder: function() {
            return r.apply(this, arguments)
        },
        PurchaseListingEventBuilder: function() {
            return o.apply(this, arguments)
        },
        MakeOfferEventBuilder: function() {
            return s.apply(this, arguments)
        },
        BidEventBuilder: function() {
            return a.apply(this, arguments)
        },
        AddToCartEventBuilder: function() {
            return u.apply(this, arguments)
        },
        RemoveFromCartEventBuilder: function() {
            return l.apply(this, arguments)
        },
        ViewListingEventBuilder: function() {
            return g.apply(this, arguments)
        },
        WatchListingEventBuilder: function() {
            return c.apply(this, arguments)
        },
        Props: {
            LISTING_ID: "listing_id",
            SKU: "sku",
            CATEGORY: "category",
            SUBCATEGORY: "sub_category",
            TITLE: "title",
            SUBTITLE: "sub_title",
            DESCRIPTION: "description",
            BUY_TYPE: "buy_type",
            PRICE: "price",
            REVENUE: "revenue",
            QUANTITY: "quantity",
            USER_ID_OF_SELLER: "user_id",
            USER_ID_OF_BUYER: "user_id",
            EXPIRATION: "expiration",
            SHIPPING_PRICE: "shipping_price",
            SHIPPING_TYPE: "shipping_type",
            LOCATION: "location",
            REASON: "removelisting_reason",
            PROMOTION_TYPE: "promotion_type",
            TRANSACTION_ID: "transaction_id",
            OFFER_ID: "offer_id",
            BID_ID: "bid_id"
        },
        Events: {
            ADD_LISTING: "add_listing",
            EDIT_LISTING: "edit_listing",
            REMOVE_LISTING: "remove_listing",
            PROMOTE_LISTING: "promote_listing",
            PURCHASE_LISTING: "purchase_listing",
            MAKE_OFFER_LISTING: "make_offer_listing",
            BID_LISTING: "bid_listing",
            ADD_TO_CART_LISTING: "add_to_cart_listing",
            REMOVE_FROM_CART_LISTING: "remove_from_cart_listing",
            VIEW_LISTING: "view_listing",
            WATCH_LISTING: "watch_listing"
        }
    }
}();