H5P.TextareaPapiJo = (function ($, EventDispatcher) {

  /**
   * A simple library for displaying text with advanced styling.
   *
   * @class H5P.TextareaPapiJo
   * @param {Object} parameters
   * @param {Object} [parameters.text='New text']
   * @param {number} id
   */
  function Textarea(parameters, id) {
    const self = this;
    EventDispatcher.call(this);
    let text = parameters.text;

    if (parameters.removeExtraLineBreaks) {
      text = text.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      text = text.replace(/(\r\n|\n|\r)/gm, "<br />");
    }
    //Allow some html tags.
    text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    
    // If tips detected remove the paragraphs which might include tips.
    const regex = /(\*.*?:.*?\*)/gm;
    if (regex.exec(text) !== null) {
      text = text.replace(/<\/p>/g, '');
      text = text.replace(/<p>/g, '<p></p>');
    }
    
    const DUMMYCHARACTER = '\u200B'; // zero-width space character
    const parseText = text.split(/(\*.*?\*)/);

    self.attach = function ($container) {
      $container.addClass('h5p-textarea-pj');
      parseText
        .forEach(function (part) {
          if ((part.substr(0, 1) === '*') && (part.substr(-1) === '*')) {
            // word has tip
            let tip = part.match(/(:([^\\*]+))/g);
            if (tip) {
              let partLen = part.length;
              tip = tip[0].replace(':', '');
              // If tip only contains a reference to an image, needs some character, so we add an invisible one.
              if ((tip.substr(0, 1) === '<')) {
                tip = DUMMYCHARACTER + tip;
                partLen = partLen + 1;
              }
              let word = part.slice(1, partLen - tip.length - 2);
              let wordLen = getWidthOfText(word, 'Sans-Serif', '16px');
              word = '<span class="text-with-tip-underline">' + word + '</span>';
              $container.append(word);
              self.$tip = H5P.JoubelTipPapiJo(tip, wordLen, true, {
                tipLabel: parameters.tipLabel,
                tabcontrol: true
              });
              $container.append(self.$tip);
            }
          }
          else {
            // is normal text
            $container.append(part);
          }
         
        });
        
    };

  }
  /* see https://stackoverflow.com/questions/2057682/determine-pixel-length-of-string-in-javascript-jquery */
  function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    var fontspec = fontsize + ' ' + fontname;
    if(getWidthOfText.ctx.font !== fontspec)
        getWidthOfText.ctx.font = fontspec;
    return getWidthOfText.ctx.measureText(txt).width;
  }

  Textarea.prototype = Object.create(EventDispatcher.prototype);
  Textarea.prototype.constructor = Textarea;

  return Textarea;

})(H5P.jQuery, H5P.EventDispatcher);
