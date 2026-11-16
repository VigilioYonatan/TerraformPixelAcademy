/* Original minimal HCL token mode for TerraPixel; highlights only, not a Terraform parser. */
(function () {
  'use strict';
  if (!window.CodeMirror) return;
  var keywords=/^(?:terraform|provider|resource|data|variable|locals|output|module|moved|import|check|run|assert|backend|provisioner|connection|dynamic|lifecycle|validation|precondition|postcondition|for_each|count|depends_on|source|required_version|required_providers|type|default|value|description|sensitive|command|condition|error_message)\b/;
  var values=/^(?:true|false|null)\b/;
  window.CodeMirror.defineMode('terrapixel-hcl', function(){
    return {
      startState:function(){return{block:false};},
      token:function(stream,state){
        if (state.block) {if(stream.skipTo('*/')){stream.match('*/');state.block=false;}else stream.skipToEnd();return 'comment';}
        if(stream.eatSpace())return null;
        if(stream.match('/*')){state.block=true;return 'comment';}
        if(stream.match('//')||stream.match('#')){stream.skipToEnd();return 'comment';}
        if(stream.match(/^"(?:[^"\\]|\\.)*"/))return 'string';
        if(stream.match(/^"(?:[^"\\]|\\.)*/))return 'string';
        if(stream.match(/^\$\{[^}]*\}/))return 'variable-2';
        if(stream.match(keywords))return 'keyword';
        if(stream.match(values))return 'atom';
        if(stream.match(/^\d+(?:\.\d+)?\b/))return 'number';
        if(stream.match(/^[a-zA-Z_][a-zA-Z\d_-]*(?=\s*=)/))return 'property';
        if(stream.match(/^[a-zA-Z_][a-zA-Z\d_-]*/))return 'variable';
        stream.next();return null;
      }
    };
  });
})();
