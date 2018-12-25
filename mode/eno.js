ace.define(function(require, exports, module) {
  'use strict';

  const oop = require('../lib/oop');
  const TextMode = require('./text').Mode;
  const EnoHighlightRules = require('./eno_highlight_rules').EnoHighlightRules;

  const Mode = function() {
    this.HighlightRules = EnoHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function() {
    this.lineCommentStart = '>';
    this.$id = 'ace/mode/eno';
  }).call(Mode.prototype);

  exports.Mode = Mode;
});
