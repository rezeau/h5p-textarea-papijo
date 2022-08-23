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

    // If text was copied-pasted from another WYSIWYG editor we must clean extra line breaks and NOT CLEANED!
    if (parameters.removeExtraLineBreaks) {
      //This javascript code replaces all 3 types of line breaks with a single space
      parameters.text = parameters.text.replace(/(\r\n|\n|\r)/gm, " ") ;
      //Replace all double white spaces with single spaces
      parameters.text = parameters.text.replace(/\s+/g, " ");
    }
    // Now deal with cleaned text at https://www.textfixer.com/tools/remove-line-breaks.php
    parameters.text = parameters.text.replace(/(\r\n|\n|\r)/gm, "<br>");

    //Allow some html tags.
    parameters.text = parameters.text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    const html = (parameters.text === undefined ? '<em>New text</em>' : parameters.text);

    /**
     * Wipe container and add text html.
     *
     * @alias H5P.AdvancedText#attach
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      $container.addClass('h5p-textarea-pj').html(html);
    };

  }

  Textarea.prototype = Object.create(EventDispatcher.prototype);
  Textarea.prototype.constructor = Textarea;

  return Textarea;

})(H5P.jQuery, H5P.EventDispatcher);
