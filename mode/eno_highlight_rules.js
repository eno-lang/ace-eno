define(function(require, exports, module) {
  'use strict';

  const oop = require('../lib/oop');
  const TextHighlightRules = require('./text_highlight_rules').TextHighlightRules;

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
          onMatch: function(value, currentState, state) {
              const tokens = value.split(this.splitRegex);
              state.unshift(this.next, tokens[3]);

              return [
                { type: 'punctuation.definition.block.begin.eno', value: tokens[1] },
                { type: 'text', value: tokens[2] },
                { type: 'entity.name.block.eno', value: tokens[3] }
              ];
          },
          regex: /(-{2,})(?!-)(\s*)(\S[^\n]*?)(?:\s*$)/
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
          // # name [<[<] template]
          regex: /(#{1,})(?!#)(\s*)([^\s<`][^\n<]*?)(\s*)(?:(<(?!<)|<<)(\s*)(\S[^\n]*?))?(?:\s*$)/,
          token: [
              'punctuation.definition.section.eno',
              'text',
              'entity.name.section.eno',
              'text',
              'punctuation.definition.section.template.eno',
              'text',
              'entity.name.section.template.eno'
          ]
        },
        {
          // | value OR \ value
          regex: /(\||\\)(\s*)(.+?)?(?:\s*$)/,
          token: [
              'punctuation.definition.continuation.eno',
              'text',
              'string.unquoted.eno'
          ]
        },
        {
          // name: [value]
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(:)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
             'variable.other.name.eno',
             'text',
             'punctuation.definition.name.eno',
             'text',
             'string.unquoted.value.eno'
          ]
        },
        {
          // name = [value]
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(=)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
             'variable.other.name.entry.eno',
             'text',
             'punctuation.definition.name.entry.eno',
             'text',
             'string.unquoted.value.eno'
          ]
        },
        {
          // name <[<] [value]
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(<)(\s*)(\S.*?)(?:\s*)$/,
          token: [
             'variable.other.name.eno',
             'text',
             'punctuation.definition.name.template.eno',
             'text',
             'variable.other.name.template.eno'
          ]
        },
        {
          // `name`: [value]
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(:)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
            'punctuation.definition.name.escape.begin.eno',
            'text',
            'variable.other.name.eno',
            'text',
            'punctuation.definition.name.escape.end.eno',
            'text',
            'punctuation.definition.name.eno',
            'text',
            'string.unquoted.value.eno'
          ]
        },
        {
          // `name` = [value]
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(=)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
            'punctuation.definition.name.escape.begin.eno',
            'text',
            'variable.other.name.eno',
            'text',
            'punctuation.definition.name.escape.end.eno',
            'text',
            'punctuation.definition.name.entry.eno',
            'text',
            'string.unquoted.value.eno'
          ]
        },
        {
          // `name` < [value]
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(<)(\s*)(\S.*?)(?:\s*)$/,
          token: [
            'punctuation.definition.name.escape.begin.eno',
            'text',
            'variable.other.name.eno',
            'text',
            'punctuation.definition.name.escape.end.eno',
            'text',
            'punctuation.definition.name.template.eno',
            'text',
            'variable.other.name.template.eno'
          ]
        },
        {
          // # `name` [<[<] template]
          regex: /(#{1,})(?!#)(\s*)(`+)(\s*)((?:(?!\3).)+)(\s*)(\3)(\s*)(?:(<(?!<)|<<)(\s*)(\S[^\n]*?))?(?:\s*$)/,
          token: [
              'punctuation.definition.section.eno',
              'text',
              'punctuation.definition.section.escape.begin.eno',
              'text',
              'entity.name.section.eno',
              'text',
              'punctuation.definition.section.escape.end.eno',
              'text',
              'punctuation.definition.section.template.eno',
              'text',
              'entity.name.section.template.eno'
          ]
        },
        {
          regex: /\S/,
          token: 'invalid.illegal.eno'
        }
      ],
      block: [
        {
          next: 'start',
          onMatch: function(value, currentState, state) {
              const tokens = value.split(this.splitRegex);

              if(state[1] === tokens[3]) {
                state.shift();
                state.shift();

                return [
                  { type: 'punctuation.definition.block.end.eno', value: tokens[1] },
                  { type: 'text', value: tokens[2] },
                  { type: 'entity.name.block.eno', value: tokens[3] }
                ];
              } else {
                return 'string.unquoted.eno';
              }
          },
          regex: /(-{2,})(?!-)(\s*)(\S[^\n]*?)(?:\s*$)/
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
