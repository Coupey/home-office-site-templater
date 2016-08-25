
(function(global) {
  "use strict";

  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  GOVUK.formUtilities = {

    // given a reference to a form element on the current page,
    // iterate through the form and construct a json object from the form element ids and values
    formToJSON: function(formRef) {
      var form = {};
      $(formRef).find(':input[name]:enabled').each( function() {
        var $self = $(this);
        var name = $self.attr('name');

        switch ($self.attr('type'))
        {
          case 'radio':
            // only save selected radio buttons - parent element will have a 'selected' class
            if($self.parent().hasClass('selected'))
            {
              form[name] = $self.val();
            }
            break;
          default:
            if (form[name]) {
              form[name] = form[name] + ',' + $self.val();
            }
            else {
               form[name] = $self.val();
            }
          }
      });

      return form;
    },

    // post data to an endpoint, call callbackSuccess or callbackFailure as appropriate
    postData: function(data, endpoint, callbackSuccess, callbackFailure, responseContentType){
      $.support.cors = true;

      var $postRequest = $.ajax({
        crossDomain : true,
        type: "POST",
        url: endpoint,
        dataType : "json",
        contentType : responseContentType,
        data: data
      });

      $postRequest.done(function(data)
      {
        if (typeof callbackSuccess === "function") {
          callbackSuccess(data);
        }
      });

      $postRequest.fail(function(jqXHR, textStatus)
      {
        if (typeof callbackFailure === "function") {
          callbackFailure(jqXHR,textStatus);
        }
      });
    },

    // get data from an endpoint, call callbackSuccess or callbackFailure as appropriate
    getData: function(endpoint, data, callbackSuccess,callbackFailure){
      $.support.cors = true;

      var $getRequest = $.ajax({
        crossDomain : true,
        type: "GET",
        url: endpoint,
        dataType : "json",
        data: data
      });

      $getRequest.done(function(data)
      {
        if (typeof callbackSuccess === "function") {
          callbackSuccess(data);
        }
      });

      $getRequest.fail(function(jqXHR, textStatus)
      {
        if (typeof callbackFailure === "function") {
          callbackFailure(jqXHR,textStatus);
        }
      });

    },

    // make list of errors on the form after parsley.js has performed validation
    showErrorSummary: function() {
      var errorList = '';

      // select elements with errors
      var $errorElements = $( ".parsley-errors-list li" );

      // construct new html with error summaries
      $( $errorElements ).each(function( index ) {

        var bits = $(this).parent()[0].id.split('-');
        var linkId = bits[bits.length-1];
        var finalLinkId = $('*[data-parsley-id=' + linkId + ']').attr('id');

        if (finalLinkId === undefined)
        {
          finalLinkId = 'id-' + linkId + '-1';
        }

        //var linkElement = 'data-parsley-id' + ()
        errorList += '<li><a href="#' + finalLinkId + '">' + $( this ).text() + '</a></li>';

      });

      // add errors to div on page
      $('#error-summary-list').html(errorList);
      $('#error-summary').show();

      // expose to screenreader
      $('#error-summary').attr('aria-expanded', 'true');
      $('#error-summary').attr('aria-hidden', 'false');

      document.getElementById('error-summary').focus();
    },

    hideErrorSummary: function()
    {
      $('#form-error-message').hide();
      $('#error-summary').hide();

      // hide from screenreader
      $('#error-summary').attr('aria-expanded', 'false');
      $('#error-summary').attr('aria-hidden', 'true');
    },

    getQueryVariable: function(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
      }
    },

    // find all the templates on the page and compile them
    compileNunjucksTemplates: function()
    {
      var templates = {};

      // find all the templates
      var templateList = $('.nunjucks-template');

      var numTemplates = templateList.length;
      for (var i=0; i < numTemplates; i++){
        var thisTemplate = templateList[i];
        var templateId = $(thisTemplate).attr('id');

        templates[templateId] = nunjucks.compile(thisTemplate.innerHTML);
      }

      return templates;
    },

    // render a given template with the passed data
    renderNunjucksTemplate: function(templateName,templateData,templates)
    {
      $('#' + templateName).html(templates[templateName].render(templateData));

    }
  };

  global.GOVUK = GOVUK;
})(window);


