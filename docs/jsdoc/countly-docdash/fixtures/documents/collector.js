"use strict";var probe=require("ink-probe");var sys=require("lodash");var dcl=require("dcl");var CollectorBase=dcl(Destroyable,{declaredClass:"CollectorBase",constructor:function(b){var a=this;if(b&&!sys.isObject(b)){throw new TypeError("Collectors require an initial object or array passed to the constructor")}this.heap=b||{};probe.mixTo(this,this.heap);Object.defineProperty(this,"length",{get:function(){return sys.size(a.heap)}});this.shuffle=sys.bind(sys.shuffle,this,this.heap)},add:function(a,b){this.heap[a]=b},each:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;sys.each(this.find(c),b,a)}else{a=b||this;sys.each(this.heap,c,a)}},toArray:function(){return sys.toArray(this.heap)},toJSON:function(){return this.heap},map:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.map(this.find(c),b,a)}else{a=b||this;return sys.map(this.heap,c,a)}},reduce:function(d,c,b,a){if(sys.isPlainObject(d)){a=a||this;return sys.reduce(this.find(d),c,b,a)}else{a=b||this;return sys.reduce(this.heap,d,c,a)}},countBy:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.countBy(this.find(c),b,a)}else{a=b||this;return sys.countBy(this.heap,c,a)}},groupBy:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.groupBy(this.find(c),b,a)}else{a=b||this;return sys.groupBy(this.heap,c,a)}},pluck:function(b,a){if(arguments.length===2){return sys.map(this.find(b),function(c){return probe.get(c,a)})}else{return sys.map(this.heap,function(c){return probe.get(c,b)})}},sortBy:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.sortBy(this.find(c),b,a)}else{a=b||this;return sys.sortBy(this.heap,c,a)}},max:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.max(this.find(c),b,a)}else{a=b||this;return sys.max(this.heap,c,a)}},min:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.min(this.find(c),b,a)}else{a=b||this;return sys.min(this.heap,c,a)}},destroy:function(){this.heap=null}});var OCollector=dcl(CollectorBase,{key:function(a){return this.heap[a]}});var ACollector=dcl(CollectorBase,{constructor:function(a){if(a&&!sys.isArray(a)){throw new TypeError("Collectors require an array passed to the constructor")}this.heap=a||[];this.difference=sys.bind(sys.difference,this,this.heap);this.tail=sys.bind(sys.tail,this,this.heap);this.head=sys.bind(sys.head,this,this.heap)},add:function(a){this.heap.unshift(a)},append:function(a){this.heap.push(a)},push:function(a){this.add(a)},compact:function(){this.heap=sys.compact(this.heap)},at:function(){var a=sys.toArray(arguments);a.unshift(this.heap);return sys.at.apply(this,a)},flatten:function(c,b,a){if(sys.isPlainObject(c)){a=a||this;return sys.flatten(this.find(c),b,a)}else{a=b||this;return sys.flatten(this.heap,c,a)}},index:function(a){return this.heap[a]}});exports.collect=function(a){if(sys.isArray(a)){return new ACollector(a)}else{return new OCollector(a)}};exports.array=function(a){return new ACollector(a)};exports.object=function(a){return new OCollector(a)};