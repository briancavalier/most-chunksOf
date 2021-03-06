(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['most-chunksOf'] = global['most-chunksOf'] || {})));
}(this, (function (exports) { 'use strict';

var FullBufferSink = function FullBufferSink(n, sink) {
    this.n = n;
    this.sink = sink;
    this.xs = [];
};
FullBufferSink.prototype.event = function event (time, value) {
    var sink = this.sink;
    this.xs.push(value);
    if (this.n === this.xs.length) {
        var list = this.xs;
        this.xs = [];
        return sink.event(time, list)
    }
};
FullBufferSink.prototype.error = function error (time, err) {
    return this.sink.error(time, err)
};
FullBufferSink.prototype.end = function end (time, value) {
    if (this.xs.length > 0) {
        this.sink.event(time, this.xs);
    }
    return this.sink.end(time, value)
};

var PartialBufferSink = (function (FullBufferSink) {
    function PartialBufferSink () {
        FullBufferSink.apply(this, arguments);
    }

    if ( FullBufferSink ) PartialBufferSink.__proto__ = FullBufferSink;
    PartialBufferSink.prototype = Object.create( FullBufferSink && FullBufferSink.prototype );
    PartialBufferSink.prototype.constructor = PartialBufferSink;

    PartialBufferSink.prototype.end = function end (time, value) {
        return this.sink.end(time, value)
    };

    return PartialBufferSink;
}(FullBufferSink));

/** @license MIT License (c) copyright 2016 original author or authors */

var chunksStream = function (n, stream, constr) { return new stream.constructor({
    run: function (sink, scheduler) { return stream.source.run(new constr(n, sink), scheduler); }
}); };

var chunksOf = function (n, stream) { return chunksStream(n, stream, FullBufferSink); };
var chunkEvery = function (n, stream) { return chunksStream(n, stream, PartialBufferSink); };

exports.chunksOf = chunksOf;
exports.chunkEvery = chunkEvery;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=most-chunksOf.js.map
