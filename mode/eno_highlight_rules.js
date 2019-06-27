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
          // -- multiline field
          next: 'multilineField',
          onMatch: function(value, currentState, state) {
              const tokens = value.split(this.splitRegex);
              state.unshift(this.next, { operator: tokens[1], key: tokens[3] });

              return [
                { type: 'punctuation.definition.multiline-field.begin.eno', value: tokens[1] },
                { type: 'text', value: tokens[2] },
                { type: 'variable.other.name.multiline-field.eno', value: tokens[3] }
              ];
          },
          regex: /(-{2,})(?!-)(\s*)(\S[^\n]*?)(?:\s*$)/
        },
        {
          // - (item)
          regex: /(-)(\s*)(.+?)?(?:\s*$)/,
          token: [
            'punctuation.definition.item.eno',
            'text',
            'string.unquoted.eno'
          ]
        },
        {
          // # section (<(<) template)
          regex: /(#{1,})(?!#)(\s*)([^\s<`][^\n<]*?)(\s*)(?:(<(?!<)|<<)(\s*)(\S[^\n]*?))?(?:\s*$)/,
          token: [
              'punctuation.definition.section.eno',
              'text',
              'entity.name.section.eno',
              'text',
              'punctuation.separator.template.eno',
              'text',
              'entity.name.section.template.eno'
          ]
        },
        {
          // | continuation OR \ continuation
          regex: /(\||\\)(\s*)(.+?)?(?:\s*$)/,
          token: [
              'punctuation.definition.continuation.eno',
              'text',
              'string.unquoted.eno'
          ]
        },
        {
          // empty
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(?:\s*)$/,
          token: [
             'variable.other.name.empty.eno'
          ]
        },
        {
          // element: (value)
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(:)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
             'variable.other.name.element.eno',
             'text',
             'punctuation.separator.element.eno',
             'text',
             'string.unquoted.value.eno'
          ]
        },
        {
          // entry = (value)
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(=)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
             'variable.other.name.fieldset-entry.eno',
             'text',
             'punctuation.separator.fieldset-entry.eno',
             'text',
             'string.unquoted.value.eno'
          ]
        },
        {
          // element < (value)
          regex: /([^\s<>\-#=:\\|`][^\n<=:]*?)(\s*)(<)(\s*)(\S.*?)(?:\s*)$/,
          token: [
             'variable.other.name.element.eno',
             'text',
             'punctuation.separator.template.eno',
             'text',
             'variable.other.name.element.template.eno'
          ]
        },
        {
          // `element`: (value)
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(:)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
            'punctuation.definition.key.escape.begin.eno',
            'text',
            'variable.other.name.element.eno',
            'text',
            'punctuation.definition.key.escape.end.eno',
            'text',
            'punctuation.separator.element.eno',
            'text',
            'string.unquoted.value.eno'
          ]
        },
        {
          // `entry` = (value)
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(=)(\s*)(\S.*?)?(?:\s*)$/,
          token: [
            'punctuation.definition.key.escape.begin.eno',
            'text',
            'variable.other.name.fieldset-entry.eno',
            'text',
            'punctuation.definition.key.escape.end.eno',
            'text',
            'punctuation.separator.fieldset-entry.eno',
            'text',
            'string.unquoted.value.eno'
          ]
        },
        {
          // `element` < template
          regex: /(`+)(\s*)((?:(?!\1).)+)(\s*)(\1)(\s*)(<)(\s*)(\S.*?)(?:\s*)$/,
          token: [
            'punctuation.definition.key.escape.begin.eno',
            'text',
            'variable.other.name.element.eno',
            'text',
            'punctuation.definition.key.escape.end.eno',
            'text',
            'punctuation.separator.template.eno',
            'text',
            'variable.other.name.element.template.eno'
          ]
        },
        {
          // # `section` (<(<) template)
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
              'punctuation.separator.template.eno',
              'text',
              'entity.name.section.template.eno'
          ]
        },
        {
          regex: /\S/,
          token: 'invalid.illegal.eno'
        }
      ],
      multilineField: [
        {
          next: 'start',
          onMatch: function(value, currentState, state) {
              const tokens = value.split(this.splitRegex);

              if(state[1].operator === tokens[1] && state[1].key === tokens[3]) {
                state.shift();
                state.shift();

                return [
                  { type: 'punctuation.definition.multiline-field.end.eno', value: tokens[1] },
                  { type: 'text', value: tokens[2] },
                  { type: 'variable.other.name.multiline-field.eno', value: tokens[3] }
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
