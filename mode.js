define(function(require, exports, module) {
  "use strict";

  const oop = require('../lib/oop');
  const TextHighlightRules = require('./text_highlight_rules').TextHighlightRules;

  // TODO: Name backreferencing for block terminator
  //       Might want to look up e.g. heredoc in ruby or php or somewhere in other modes

  const EnoHighlightRules = function() {
    this.$rules = {
      start: [
        {
          // > [comment]
          regex: '>.*',
          token: 'comment.line.eno'
        },
        {
          // -- name
          next: 'block',
          regex: /(-{2,})(\s*)([^\s-][^\n]*?)(?:\s*$)/, // TODO: wrong! name may start with - but only with space inbetween
          token: [
            'punctuation.definition.block.begin.eno',
            'text',
            'entity.name.block.eno'
          ]
        },
        {
          // - [value]
          regex: /(-)(\s*)(.+?)?(?:\s*$)/,
          token: [
            'punctuation.definition.item.eno',
            'text',
            'string.unquoted.eno'
          ]
        },
        {
          regex: /(#)(?!#)\s*([^\s<`][^<]*?)\s*(?:(<(?!<)|<<)\s*(\S.*?)\s*)?$/,
          token: [
              'section'
          ]
        },
        {
          token: 'foo',
          regex: /(?![>\-#=:*\\|`])([^<=:]+?)\s*(:)\s*$/
        }
      ],
      block: [
        {
          next: 'start',
          regex: /(-{2,})(\s*)([^\s-][^\n]*?)(?:\s*$)/,
          token: [
            'punctuation.definition.block.begin.eno',
            'block-end'
          ]
        },
        {
          defaultToken: 'string.unquoted.eno'
        }
      ]
    };

    this.normalizeRules();
  };

  EnoHighlightRules.metaData = {
    fileTypes: ['eno'],
    name: 'Eno',
    scopeName: 'text.eno'
  };

  oop.inherits(EnoHighlightRules, TextHighlightRules);

  exports.EnoHighlightRules = EnoHighlightRules;
});
