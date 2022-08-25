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
    parameters.tipLabel = "Show tip";
    let text = parameters.text;
    // If text was copied-pasted from another WYSIWYG editor we must clean extra line breaks and NOT CLEANED!
    if (parameters.removeExtraLineBreaks) {
      //This javascript code replaces all 3 types of line breaks with a single space
      text = text.replace(/(\r\n|\n|\r)/gm, " ") ;
      //Replace all double white spaces with single spaces
      text = text.replace(/\s+/g, " ");
    }
    // Now deal with cleaned text at https://www.textfixer.com/tools/remove-line-breaks.php
    text = text.replace(/(\r\n|\n|\r)/gm, "<br>");

    //Allow some html tags.
    text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const DUMMYCHARACTER = '\u200B'; // zero-width space character
    const parseText = text.split(/(\*.*?\*)/);
    self.attach = function ($container) {
      $container.addClass('h5p-textarea-pj');
      parseText
        .forEach(function (part) {
          if ((part.substr(0, 1) === '*') && (part.substr(-1) === '*') && (part.indexOf(':') > -1)) {
            // word has tip
            let tip = part.match(/(:([^\\*]+))/g);
            if (tip) {
              let partLen = part.length;
              tip = tip[0].replace(':', '');
              // If tip only contains a reference to an image, needs some character, so we add an invisible one.
              if ((tip.substr(0, 4) === '<img')) {
                tip = tip.replace('<img', DUMMYCHARACTER + '​<img');
                partLen = partLen + 2;
              }
              let word = part.slice(1, partLen - tip.length - 2);
              word = '<em>' + word + '</em>';
              $container.append(word);
              self.$tip = H5P.JoubelUI.createTip(tip, {
                tipLabel: parameters.tipLabel,
                tabcontrol: true
              });
              $container.append(self.$tip);
            }
          }
          else {
            // is normal text
            const el = document.createElement('span');
            el.innerHTML = text;
            $container.append(part);
          }
        });

    };

  }

  Textarea.prototype = Object.create(EventDispatcher.prototype);
  Textarea.prototype.constructor = Textarea;

  return Textarea;

})(H5P.jQuery, H5P.EventDispatcher);
