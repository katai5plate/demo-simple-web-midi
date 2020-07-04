/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/midi-file/index.js":
/*!*****************************************!*\
  !*** ./node_modules/midi-file/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.parseMidi = __webpack_require__(/*! ./lib/midi-parser */ \"./node_modules/midi-file/lib/midi-parser.js\")\nexports.writeMidi = __webpack_require__(/*! ./lib/midi-writer */ \"./node_modules/midi-file/lib/midi-writer.js\")\n\n\n//# sourceURL=webpack:///./node_modules/midi-file/index.js?");

/***/ }),

/***/ "./node_modules/midi-file/lib/midi-parser.js":
/*!***************************************************!*\
  !*** ./node_modules/midi-file/lib/midi-parser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// data can be any array-like object.  It just needs to support .length, .slice, and an element getter []\n\nfunction parseMidi(data) {\n  var p = new Parser(data)\n\n  var headerChunk = p.readChunk()\n  if (headerChunk.id != 'MThd')\n    throw \"Bad MIDI file.  Expected 'MHdr', got: '\" + headerChunk.id + \"'\"\n  var header = parseHeader(headerChunk.data)\n\n  var tracks = []\n  for (var i=0; !p.eof() && i < header.numTracks; i++) {\n    var trackChunk = p.readChunk()\n    if (trackChunk.id != 'MTrk')\n      throw \"Bad MIDI file.  Expected 'MTrk', got: '\" + trackChunk.id + \"'\"\n    var track = parseTrack(trackChunk.data)\n    tracks.push(track)\n  }\n\n  return {\n    header: header,\n    tracks: tracks\n  }\n}\n\n\nfunction parseHeader(data) {\n  var p = new Parser(data)\n\n  var format = p.readUInt16()\n  var numTracks = p.readUInt16()\n\n  var result = {\n    format: format,\n    numTracks: numTracks\n  }\n\n  var timeDivision = p.readUInt16()\n  if (timeDivision & 0x8000) {\n    result.framesPerSecond = 0x100 - (timeDivision >> 8)\n    result.ticksPerFrame = timeDivision & 0xFF\n  } else {\n    result.ticksPerBeat = timeDivision\n  }\n\n  return result\n}\n\nfunction parseTrack(data) {\n  var p = new Parser(data)\n\n  var events = []\n  while (!p.eof()) {\n    var event = readEvent()\n    events.push(event)\n  }\n\n  return events\n\n  var lastEventTypeByte = null\n\n  function readEvent() {\n    var event = {}\n    event.deltaTime = p.readVarInt()\n\n    var eventTypeByte = p.readUInt8()\n\n    if ((eventTypeByte & 0xf0) === 0xf0) {\n      // system / meta event\n      if (eventTypeByte === 0xff) {\n        // meta event\n        event.meta = true\n        var metatypeByte = p.readUInt8()\n        var length = p.readVarInt()\n        switch (metatypeByte) {\n          case 0x00:\n            event.type = 'sequenceNumber'\n            if (length !== 2) throw \"Expected length for sequenceNumber event is 2, got \" + length\n            event.number = p.readUInt16()\n            return event\n          case 0x01:\n            event.type = 'text'\n            event.text = p.readString(length)\n            return event\n          case 0x02:\n            event.type = 'copyrightNotice'\n            event.text = p.readString(length)\n            return event\n          case 0x03:\n            event.type = 'trackName'\n            event.text = p.readString(length)\n            return event\n          case 0x04:\n            event.type = 'instrumentName'\n            event.text = p.readString(length)\n            return event\n          case 0x05:\n            event.type = 'lyrics'\n            event.text = p.readString(length)\n            return event\n          case 0x06:\n            event.type = 'marker'\n            event.text = p.readString(length)\n            return event\n          case 0x07:\n            event.type = 'cuePoint'\n            event.text = p.readString(length)\n            return event\n          case 0x20:\n            event.type = 'channelPrefix'\n            if (length != 1) throw \"Expected length for channelPrefix event is 1, got \" + length\n            event.channel = p.readUInt8()\n            return event\n          case 0x21:\n            event.type = 'portPrefix'\n            if (length != 1) throw \"Expected length for portPrefix event is 1, got \" + length\n            event.port = p.readUInt8()\n            return event\n          case 0x2f:\n            event.type = 'endOfTrack'\n            if (length != 0) throw \"Expected length for endOfTrack event is 0, got \" + length\n            return event\n          case 0x51:\n            event.type = 'setTempo';\n            if (length != 3) throw \"Expected length for setTempo event is 3, got \" + length\n            event.microsecondsPerBeat = p.readUInt24()\n            return event\n          case 0x54:\n            event.type = 'smpteOffset';\n            if (length != 5) throw \"Expected length for smpteOffset event is 5, got \" + length\n            var hourByte = p.readUInt8()\n            var FRAME_RATES = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }\n            event.frameRate = FRAME_RATES[hourByte & 0x60]\n            event.hour = hourByte & 0x1f\n            event.min = p.readUInt8()\n            event.sec = p.readUInt8()\n            event.frame = p.readUInt8()\n            event.subFrame = p.readUInt8()\n            return event\n          case 0x58:\n            event.type = 'timeSignature'\n            if (length != 4) throw \"Expected length for timeSignature event is 4, got \" + length\n            event.numerator = p.readUInt8()\n            event.denominator = (1 << p.readUInt8())\n            event.metronome = p.readUInt8()\n            event.thirtyseconds = p.readUInt8()\n            return event\n          case 0x59:\n            event.type = 'keySignature'\n            if (length != 2) throw \"Expected length for keySignature event is 2, got \" + length\n            event.key = p.readInt8()\n            event.scale = p.readUInt8()\n            return event\n          case 0x7f:\n            event.type = 'sequencerSpecific'\n            event.data = p.readBytes(length)\n            return event\n          default:\n            event.type = 'unknownMeta'\n            event.data = p.readBytes(length)\n            event.metatypeByte = metatypeByte\n            return event\n        }\n      } else if (eventTypeByte == 0xf0) {\n        event.type = 'sysEx'\n        var length = p.readVarInt()\n        event.data = p.readBytes(length)\n        return event\n      } else if (eventTypeByte == 0xf7) {\n        event.type = 'endSysEx'\n        var length = p.readVarInt()\n        event.data = p.readBytes(length)\n        return event\n      } else {\n        throw \"Unrecognised MIDI event type byte: \" + eventTypeByte\n      }\n    } else {\n      // channel event\n      var param1\n      if ((eventTypeByte & 0x80) === 0) {\n        // running status - reuse lastEventTypeByte as the event type.\n        // eventTypeByte is actually the first parameter\n        if (lastEventTypeByte === null)\n          throw \"Running status byte encountered before status byte\"\n        param1 = eventTypeByte\n        eventTypeByte = lastEventTypeByte\n        event.running = true\n      } else {\n        param1 = p.readUInt8()\n        lastEventTypeByte = eventTypeByte\n      }\n      var eventType = eventTypeByte >> 4\n      event.channel = eventTypeByte & 0x0f\n      switch (eventType) {\n        case 0x08:\n          event.type = 'noteOff'\n          event.noteNumber = param1\n          event.velocity = p.readUInt8()\n          return event\n        case 0x09:\n          var velocity = p.readUInt8()\n          event.type = velocity === 0 ? 'noteOff' : 'noteOn'\n          event.noteNumber = param1\n          event.velocity = velocity\n          if (velocity === 0) event.byte9 = true\n          return event\n        case 0x0a:\n          event.type = 'noteAftertouch'\n          event.noteNumber = param1\n          event.amount = p.readUInt8()\n          return event\n        case 0x0b:\n          event.type = 'controller'\n          event.controllerType = param1\n          event.value = p.readUInt8()\n          return event\n        case 0x0c:\n          event.type = 'programChange'\n          event.programNumber = param1\n          return event\n        case 0x0d:\n          event.type = 'channelAftertouch'\n          event.amount = param1\n          return event\n        case 0x0e:\n          event.type = 'pitchBend'\n          event.value = (param1 + (p.readUInt8() << 7)) - 0x2000\n          return event\n        default:\n          throw \"Unrecognised MIDI event type: \" + eventType\n      }\n    }\n  }\n}\n\nfunction Parser(data) {\n  this.buffer = data\n  this.bufferLen = this.buffer.length\n  this.pos = 0\n}\n\nParser.prototype.eof = function() {\n  return this.pos >= this.bufferLen\n}\n\nParser.prototype.readUInt8 = function() {\n  var result = this.buffer[this.pos]\n  this.pos += 1\n  return result\n}\n\nParser.prototype.readInt8 = function() {\n  var u = this.readUInt8()\n  if (u & 0x80)\n    return u - 0x100\n  else\n    return u\n}\n\nParser.prototype.readUInt16 = function() {\n  var b0 = this.readUInt8(),\n      b1 = this.readUInt8()\n\n    return (b0 << 8) + b1\n}\n\nParser.prototype.readInt16 = function() {\n  var u = this.readUInt16()\n  if (u & 0x8000)\n    return u - 0x10000\n  else\n    return u\n}\n\nParser.prototype.readUInt24 = function() {\n  var b0 = this.readUInt8(),\n      b1 = this.readUInt8(),\n      b2 = this.readUInt8()\n\n    return (b0 << 16) + (b1 << 8) + b2\n}\n\nParser.prototype.readInt24 = function() {\n  var u = this.readUInt24()\n  if (u & 0x800000)\n    return u - 0x1000000\n  else\n    return u\n}\n\nParser.prototype.readUInt32 = function() {\n  var b0 = this.readUInt8(),\n      b1 = this.readUInt8(),\n      b2 = this.readUInt8(),\n      b3 = this.readUInt8()\n\n    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3\n}\n\nParser.prototype.readBytes = function(len) {\n  var bytes = this.buffer.slice(this.pos, this.pos + len)\n  this.pos += len\n  return bytes\n}\n\nParser.prototype.readString = function(len) {\n  var bytes = this.readBytes(len)\n  return String.fromCharCode.apply(null, bytes)\n}\n\nParser.prototype.readVarInt = function() {\n  var result = 0\n  while (!this.eof()) {\n    var b = this.readUInt8()\n    if (b & 0x80) {\n      result += (b & 0x7f)\n      result <<= 7\n    } else {\n      // b is last byte\n      return result + b\n    }\n  }\n  // premature eof\n  return result\n}\n\nParser.prototype.readChunk = function() {\n  var id = this.readString(4)\n  var length = this.readUInt32()\n  var data = this.readBytes(length)\n  return {\n    id: id,\n    length: length,\n    data: data\n  }\n}\n\nmodule.exports = parseMidi\n\n\n//# sourceURL=webpack:///./node_modules/midi-file/lib/midi-parser.js?");

/***/ }),

/***/ "./node_modules/midi-file/lib/midi-writer.js":
/*!***************************************************!*\
  !*** ./node_modules/midi-file/lib/midi-writer.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// data should be the same type of format returned by parseMidi\n// for maximum compatibililty, returns an array of byte values, suitable for conversion to Buffer, Uint8Array, etc.\n\n// opts:\n// - running              reuse previous eventTypeByte when possible, to compress file\n// - useByte9ForNoteOff   use 0x09 for noteOff when velocity is zero\n\nfunction writeMidi(data, opts) {\n  if (typeof data !== 'object')\n    throw 'Invalid MIDI data'\n\n  opts = opts || {}\n\n  var header = data.header || {}\n  var tracks = data.tracks || []\n  var i, len = tracks.length\n\n  var w = new Writer()\n  writeHeader(w, header, len)\n\n  for (i=0; i < len; i++) {\n    writeTrack(w, tracks[i], opts)\n  }\n\n  return w.buffer\n}\n\nfunction writeHeader(w, header, numTracks) {\n  var format = header.format == null ? 1 : header.format\n\n  var timeDivision = 128\n  if (header.timeDivision) {\n    timeDivision = header.timeDivision\n  } else if (header.ticksPerFrame && header.framesPerSecond) {\n    timeDivision = (-(header.framesPerSecond & 0xFF) << 8) | (header.ticksPerFrame & 0xFF)\n  } else if (header.ticksPerBeat) {\n    timeDivision = header.ticksPerBeat & 0x7FFF\n  }\n\n  var h = new Writer()\n  h.writeUInt16(format)\n  h.writeUInt16(numTracks)\n  h.writeUInt16(timeDivision)\n\n  w.writeChunk('MThd', h.buffer)\n}\n\nfunction writeTrack(w, track, opts) {\n  var t = new Writer()\n  var i, len = track.length\n  var eventTypeByte = null\n  for (i=0; i < len; i++) {\n    // Reuse last eventTypeByte when opts.running is set, or event.running is explicitly set on it.\n    // parseMidi will set event.running for each event, so that we can get an exact copy by default.\n    // Explicitly set opts.running to false, to override event.running and never reuse last eventTypeByte.\n    if (opts.running === false || !opts.running && !track[i].running) eventTypeByte = null\n\n    eventTypeByte = writeEvent(t, track[i], eventTypeByte, opts.useByte9ForNoteOff)\n  }\n  w.writeChunk('MTrk', t.buffer)\n}\n\nfunction writeEvent(w, event, lastEventTypeByte, useByte9ForNoteOff) {\n  var type = event.type\n  var deltaTime = event.deltaTime\n  var text = event.text || ''\n  var data = event.data || []\n  var eventTypeByte = null\n  w.writeVarInt(deltaTime)\n\n  switch (type) {\n    // meta events\n    case 'sequenceNumber':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x00)\n      w.writeVarInt(2)\n      w.writeUInt16(event.number)\n      break;\n\n    case 'text':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x01)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'copyrightNotice':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x02)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'trackName':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x03)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'instrumentName':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x04)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'lyrics':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x05)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'marker':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x06)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'cuePoint':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x07)\n      w.writeVarInt(text.length)\n      w.writeString(text)\n      break;\n\n    case 'channelPrefix':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x20)\n      w.writeVarInt(1)\n      w.writeUInt8(event.channel)\n      break;\n\n    case 'portPrefix':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x21)\n      w.writeVarInt(1)\n      w.writeUInt8(event.port)\n      break;\n\n    case 'endOfTrack':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x2F)\n      w.writeVarInt(0)\n      break;\n\n    case 'setTempo':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x51)\n      w.writeVarInt(3)\n      w.writeUInt24(event.microsecondsPerBeat)\n      break;\n\n    case 'smpteOffset':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x54)\n      w.writeVarInt(5)\n      var FRAME_RATES = { 24: 0x00, 25: 0x20, 29: 0x40, 30: 0x60 }\n      var hourByte = (event.hour & 0x1F) | FRAME_RATES[event.frameRate]\n      w.writeUInt8(hourByte)\n      w.writeUInt8(event.min)\n      w.writeUInt8(event.sec)\n      w.writeUInt8(event.frame)\n      w.writeUInt8(event.subFrame)\n      break;\n\n    case 'timeSignature':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x58)\n      w.writeVarInt(4)\n      w.writeUInt8(event.numerator)\n      var denominator = Math.floor((Math.log(event.denominator) / Math.LN2)) & 0xFF\n      w.writeUInt8(denominator)\n      w.writeUInt8(event.metronome)\n      w.writeUInt8(event.thirtyseconds || 8)\n      break;\n\n    case 'keySignature':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x59)\n      w.writeVarInt(2)\n      w.writeInt8(event.key)\n      w.writeUInt8(event.scale)\n      break;\n\n    case 'sequencerSpecific':\n      w.writeUInt8(0xFF)\n      w.writeUInt8(0x7F)\n      w.writeVarInt(data.length)\n      w.writeBytes(data)\n      break;\n\n    case 'unknownMeta':\n      if (event.metatypeByte != null) {\n        w.writeUInt8(0xFF)\n        w.writeUInt8(event.metatypeByte)\n        w.writeVarInt(data.length)\n        w.writeBytes(data)\n      }\n      break;\n\n    // system-exclusive\n    case 'sysEx':\n      w.writeUInt8(0xF0)\n      w.writeVarInt(data.length)\n      w.writeBytes(data)\n      break;\n\n    case 'endSysEx':\n      w.writeUInt8(0xF7)\n      w.writeVarInt(data.length)\n      w.writeBytes(data)\n      break;\n\n    // channel events\n    case 'noteOff':\n      // Use 0x90 when opts.useByte9ForNoteOff is set and velocity is zero, or when event.byte9 is explicitly set on it.\n      // parseMidi will set event.byte9 for each event, so that we can get an exact copy by default.\n      // Explicitly set opts.useByte9ForNoteOff to false, to override event.byte9 and always use 0x80 for noteOff events.\n      var noteByte = ((useByte9ForNoteOff !== false && event.byte9) || (useByte9ForNoteOff && event.velocity == 0)) ? 0x90 : 0x80\n\n      eventTypeByte = noteByte | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.noteNumber)\n      w.writeUInt8(event.velocity)\n      break;\n\n    case 'noteOn':\n      eventTypeByte = 0x90 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.noteNumber)\n      w.writeUInt8(event.velocity)\n      break;\n\n    case 'noteAftertouch':\n      eventTypeByte = 0xA0 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.noteNumber)\n      w.writeUInt8(event.amount)\n      break;\n\n    case 'controller':\n      eventTypeByte = 0xB0 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.controllerType)\n      w.writeUInt8(event.value)\n      break;\n\n    case 'programChange':\n      eventTypeByte = 0xC0 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.programNumber)\n      break;\n\n    case 'channelAftertouch':\n      eventTypeByte = 0xD0 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      w.writeUInt8(event.amount)\n      break;\n\n    case 'pitchBend':\n      eventTypeByte = 0xE0 | event.channel\n      if (eventTypeByte !== lastEventTypeByte) w.writeUInt8(eventTypeByte)\n      var value14 = 0x2000 + event.value\n      var lsb14 = (value14 & 0x7F)\n      var msb14 = (value14 >> 7) & 0x7F\n      w.writeUInt8(lsb14)\n      w.writeUInt8(msb14)\n    break;\n\n    default:\n      throw 'Unrecognized event type: ' + type\n  }\n  return eventTypeByte\n}\n\n\nfunction Writer() {\n  this.buffer = []\n}\n\nWriter.prototype.writeUInt8 = function(v) {\n  this.buffer.push(v & 0xFF)\n}\nWriter.prototype.writeInt8 = Writer.prototype.writeUInt8\n\nWriter.prototype.writeUInt16 = function(v) {\n  var b0 = (v >> 8) & 0xFF,\n      b1 = v & 0xFF\n\n  this.writeUInt8(b0)\n  this.writeUInt8(b1)\n}\nWriter.prototype.writeInt16 = Writer.prototype.writeUInt16\n\nWriter.prototype.writeUInt24 = function(v) {\n  var b0 = (v >> 16) & 0xFF,\n      b1 = (v >> 8) & 0xFF,\n      b2 = v & 0xFF\n\n  this.writeUInt8(b0)\n  this.writeUInt8(b1)\n  this.writeUInt8(b2)\n}\nWriter.prototype.writeInt24 = Writer.prototype.writeUInt24\n\nWriter.prototype.writeUInt32 = function(v) {\n  var b0 = (v >> 24) & 0xFF,\n      b1 = (v >> 16) & 0xFF,\n      b2 = (v >> 8) & 0xFF,\n      b3 = v & 0xFF\n\n  this.writeUInt8(b0)\n  this.writeUInt8(b1)\n  this.writeUInt8(b2)\n  this.writeUInt8(b3)\n}\nWriter.prototype.writeInt32 = Writer.prototype.writeUInt32\n\n\nWriter.prototype.writeBytes = function(arr) {\n  this.buffer = this.buffer.concat(Array.prototype.slice.call(arr, 0))\n}\n\nWriter.prototype.writeString = function(str) {\n  var i, len = str.length, arr = []\n  for (i=0; i < len; i++) {\n    arr.push(str.codePointAt(i))\n  }\n  this.writeBytes(arr)\n}\n\nWriter.prototype.writeVarInt = function(v) {\n  if (v < 0) throw \"Cannot write negative variable-length integer\"\n\n  if (v <= 0x7F) {\n    this.writeUInt8(v)\n  } else {\n    var i = v\n    var bytes = []\n    bytes.push(i & 0x7F)\n    i >>= 7\n    while (i) {\n      var b = i & 0x7F | 0x80\n      bytes.push(b)\n      i >>= 7\n    }\n    this.writeBytes(bytes.reverse())\n  }\n}\n\nWriter.prototype.writeChunk = function(id, data) {\n  this.writeString(id)\n  this.writeUInt32(data.length)\n  this.writeBytes(data)\n}\n\nmodule.exports = writeMidi\n\n\n//# sourceURL=webpack:///./node_modules/midi-file/lib/midi-writer.js?");

/***/ }),

/***/ "./src/Channel.ts":
/*!************************!*\
  !*** ./src/Channel.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Channel; });\n/* harmony import */ var _Note__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Note */ \"./src/Note.ts\");\n\r\n/**\r\n * チャンネルの音符の状態管理\r\n */\r\nclass Channel {\r\n    constructor(context, params) {\r\n        this.context = context;\r\n        this.vadsr = params.vadsr;\r\n        this.oscType = params.oscType || \"sine\";\r\n        this.polyState = {};\r\n        this.globalSend = new GainNode(this.context);\r\n        this.globalSend.connect(this.context.destination);\r\n    }\r\n    /** Node を作成する */\r\n    startNote(noteNumber, pitch) {\r\n        this.polyState[noteNumber] = new _Note__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.context, {\r\n            noteNumber,\r\n            pitch,\r\n            vadsr: this.vadsr,\r\n            oscType: this.oscType,\r\n        });\r\n        // 出力を globalSend に繋げる\r\n        this.polyState[noteNumber].out.connect(this.globalSend);\r\n        // Note を使い終わったら自動的に cleanNote が走るようにする\r\n        this.polyState[noteNumber].osc.onended = this.cleanNote.bind(this, noteNumber);\r\n    }\r\n    /** すべての Note を取得 */\r\n    getAllNote() {\r\n        return Object.values(this.polyState);\r\n    }\r\n    /** ピッチを変更する */\r\n    setPitch(pitch) {\r\n        return this.getAllNote().forEach((x) => x.osc.setPitch(pitch / 8192));\r\n    }\r\n    /** Note の出力を終え、Release 処理へ移行させる */\r\n    stopNote(noteNumber) {\r\n        if (this.polyState[noteNumber])\r\n            this.polyState[noteNumber].up();\r\n    }\r\n    /** 完全に役目を終えた Note を削除する */\r\n    cleanNote(noteNumber) {\r\n        console.log(this.polyState[noteNumber].env.getPhase() === -1 ? \"clear:\" : \"keep:\", noteNumber, Object.keys(this.polyState).length);\r\n        if (this.polyState[noteNumber].env.getPhase() === -1)\r\n            delete this.polyState[noteNumber];\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/Channel.ts?");

/***/ }),

/***/ "./src/Envelope.ts":
/*!*************************!*\
  !*** ./src/Envelope.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Envelope; });\n/**\r\n * エンベロープ\r\n */\r\nclass Envelope extends GainNode {\r\n    constructor(context, params) {\r\n        super(context);\r\n        [\r\n            this.volume,\r\n            this.attack,\r\n            this.decay,\r\n            this.sustain,\r\n            this.release,\r\n        ] = params.vadsr;\r\n        this.gain.value = 0;\r\n        this.stopTime = NaN;\r\n        this.down();\r\n    }\r\n    /** 今のエンベロープの状態を取得する */\r\n    getPhase() {\r\n        if (this.context.currentTime < this.attackTime)\r\n            return 0;\r\n        if (this.context.currentTime < this.decayTime)\r\n            return 1;\r\n        if (Number.isNaN(this.stopTime))\r\n            return 2;\r\n        if (this.context.currentTime < this.stopTime)\r\n            return 3;\r\n        return -1;\r\n    }\r\n    /** 鍵盤を押し始める */\r\n    down() {\r\n        this.attackTime = this.context.currentTime + this.attack;\r\n        this.decayTime = this.attackTime + this.decay;\r\n        this.gain.setValueAtTime(0, this.context.currentTime);\r\n        this.gain.linearRampToValueAtTime(this.volume, this.attackTime);\r\n        this.gain.linearRampToValueAtTime(this.volume * this.sustain, this.decayTime);\r\n    }\r\n    /** 鍵盤を離す */\r\n    up() {\r\n        this.stopTime = this.context.currentTime + this.release;\r\n        this.gain.setValueAtTime(this.gain.value, this.context.currentTime);\r\n        this.gain.linearRampToValueAtTime(0, this.stopTime);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/Envelope.ts?");

/***/ }),

/***/ "./src/Note.ts":
/*!*********************!*\
  !*** ./src/Note.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Note; });\n/* harmony import */ var _Oscillator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Oscillator */ \"./src/Oscillator.ts\");\n/* harmony import */ var _Envelope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Envelope */ \"./src/Envelope.ts\");\n\r\n\r\n/**\r\n * 音符\r\n */\r\nclass Note {\r\n    constructor(context, params) {\r\n        this.context = context;\r\n        this.noteNumber = params.noteNumber;\r\n        this.pitch = params.pitch;\r\n        this.vadsr = params.vadsr;\r\n        this.oscType = params.oscType;\r\n        this.out = new GainNode(this.context);\r\n        this.connection();\r\n        this.down();\r\n    }\r\n    connection() {\r\n        this.osc = new _Oscillator__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.context, {\r\n            noteNumber: this.noteNumber,\r\n            type: this.oscType,\r\n            pitch: this.pitch,\r\n        });\r\n        this.env = new _Envelope__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.context, {\r\n            vadsr: this.vadsr,\r\n        });\r\n        this.osc.connect(this.env).connect(this.out);\r\n    }\r\n    down() {\r\n        this.env.down();\r\n        this.osc.start();\r\n    }\r\n    up() {\r\n        this.env.up();\r\n        this.osc.stop(this.env.stopTime);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/Note.ts?");

/***/ }),

/***/ "./src/Oscillator.ts":
/*!***************************!*\
  !*** ./src/Oscillator.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Oscillator; });\n/**\r\n * 音色と音程\r\n */\r\nclass Oscillator extends OscillatorNode {\r\n    constructor(context, params) {\r\n        super(context);\r\n        this.noteNumber = params.noteNumber;\r\n        this.type = params.type;\r\n        this.pitch = params.pitch;\r\n        this.setFrequency();\r\n    }\r\n    /** 音階とピッチから周波数を計算する */\r\n    setFrequency() {\r\n        this.frequency.value =\r\n            440 * Math.pow(2, ((this.noteNumber + this.pitch - 69) / 12));\r\n    }\r\n    /** ピッチを変更する */\r\n    setPitch(pitch) {\r\n        this.pitch = pitch;\r\n        this.setFrequency();\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/Oscillator.ts?");

/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Player; });\n/* harmony import */ var _Channel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Channel */ \"./src/Channel.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __asyncValues = (undefined && undefined.__asyncValues) || function (o) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var m = o[Symbol.asyncIterator], i;\r\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\r\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\r\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\r\n};\r\n\r\n/**\r\n * 再生プレイヤー\r\n */\r\nclass Player {\r\n    constructor(context, params) {\r\n        this.context = context;\r\n        this.track = params.track;\r\n        this.channels = params.channels.map((channelParams) => new _Channel__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.context, channelParams));\r\n        this.ticksPerBeat = params.ticksPerBeat;\r\n        this.bpm = params.bpm;\r\n        this.generateInterpreters();\r\n        this.readInterpreters();\r\n    }\r\n    /** イベントリストの音符のタイミング時間を BPM と合わせる */\r\n    generateInterpreters() {\r\n        this.interpreters = this.track.map((event) => () => new Promise((r) => setTimeout(() => r(event), (event.deltaTime / this.ticksPerBeat) * (60000 / this.bpm))));\r\n    }\r\n    /** イベントリストを再生する */\r\n    readInterpreters() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            yield Promise.all(this.channels.map((channel, currentChannelId) => __awaiter(this, void 0, void 0, function* () {\r\n                var e_1, _a;\r\n                try {\r\n                    for (var _b = __asyncValues(this.interpreters.slice(1)), _c; _c = yield _b.next(), !_c.done;) {\r\n                        let elm = _c.value;\r\n                        const event = yield elm();\r\n                        console.log(event);\r\n                        if (event.channel === currentChannelId) {\r\n                            if (event.type === \"noteOn\")\r\n                                channel.startNote(event.noteNumber, 0);\r\n                            if (event.type === \"noteOff\")\r\n                                channel.stopNote(event.noteNumber);\r\n                            if (event.type === \"pitchBend\")\r\n                                channel.setPitch(event.value);\r\n                        }\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            })));\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/Player.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var midi_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! midi-file */ \"./node_modules/midi-file/index.js\");\n/* harmony import */ var midi_file__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(midi_file__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ \"./src/Player.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\n\r\n(() => __awaiter(void 0, void 0, void 0, function* () {\r\n    /** MIDI ファイルのバイナリ情報 */\r\n    const filebuf = new Uint8Array(yield (yield fetch(\"./midi/song.mid\")).arrayBuffer());\r\n    /** JSON パースされた MIDI ファイル */\r\n    const midi = Object(midi_file__WEBPACK_IMPORTED_MODULE_0__[\"parseMidi\"])(filebuf);\r\n    console.log(\"MIDI:\", midi);\r\n    // 「MIDI を再生する」ボタンが押されたとき\r\n    window.play = () => {\r\n        document.querySelector(\"#play\").remove();\r\n        // 再生するために必要な情報を入力\r\n        new _Player__WEBPACK_IMPORTED_MODULE_1__[\"default\"](new AudioContext(), {\r\n            // MIDI のイベントリスト\r\n            track: midi.tracks[0],\r\n            // 分解能\r\n            ticksPerBeat: midi.header.ticksPerBeat,\r\n            // テンポ\r\n            bpm: 140,\r\n            // 各チャンネルの音色設定\r\n            channels: [\r\n                {\r\n                    vadsr: [0.5, 0, 0.1, 0.75, 0],\r\n                    oscType: \"triangle\",\r\n                },\r\n                {\r\n                    vadsr: [0.5, 0, 0, 0.5, 0],\r\n                    oscType: \"sawtooth\",\r\n                },\r\n                {\r\n                    vadsr: [0.5, 0, 0.1, 0.5, 0.5],\r\n                    oscType: \"sine\",\r\n                },\r\n                {\r\n                    vadsr: [0.5, 0, 0, 0.5, 0],\r\n                    oscType: \"square\",\r\n                },\r\n            ],\r\n        });\r\n        window.play = null;\r\n    };\r\n}))();\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });