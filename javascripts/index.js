

// do not erase - helper for JSLint
/*jslint formUtilities: true */

var thisFormInstance = $('#uan-search'),
    formData,
    previousUAN,
    previousStatus,
    parsleyForm;


$(document).ready(function(){
  'use strict';

  $('.error-summary').hide();
  $('.error-summary').removeClass('hidden');

  // check query string for UAN
  previousUAN = GOVUK.formUtilities.getQueryVariable('uan');

  if (previousUAN !== undefined){
    previousStatus = GOVUK.formUtilities.getQueryVariable('status');
    showResultBanner(previousUAN,previousStatus);
  }


  // attach parsley validation to the form
  parsleyForm = thisFormInstance.parsley({
    excluded: 'input[type=button], input[type=submit], input[type=reset]',
    focus:"none"
  });


  // before form is validated, catch the event and do custom validation if needed
  thisFormInstance.parsley().on('form:validate', function(formInstance) {

    var ok = true;
    //ok = ok && checkDiagnosisFutureDate();
    //ok = ok && validateDOB();

    if (!ok) {
      formInstance.validationResult = false;
      // check error classess
      setTimeout(function() {
        //checkErrorClass();
      }, 50);
    } else {
      formInstance.validationResult = true;
    }
  });


  // what to do when form doesn't validate
  thisFormInstance.parsley().on('form:error', function(formInstance) {
    //console.log('form error');

    // construct error display
    GOVUK.formUtilities.showErrorSummary();
    
  });


  // what to do when form validates successfully
  thisFormInstance.parsley().on('form:submit', function(formInstance) {
    //console.log('form success');
    GOVUK.formUtilities.hideErrorSummary();

    submitForm();

    return false;
  });
  
});


// validate and send ajax request to server if no problems
function submitForm()
{
  'use strict';

  var callbackSuccess = function(response){
    
    // redirect to page with UAN in querystring
    var destUrl = 'details.html?uan=' + $('#uan').val();
    document.location.href = (destUrl);


  };

  var callbackFailure = function(jqXHR){
    // perform error functionality

    // redirect to error page
    // setTimeout(function(){ $('#wait').hide(); window.location = "error.html";}, 1000);

  };

  // post the data to the server
  var endpoint = GOVUK.appConfig.getApplicationDetail + encodeURI($('#uan').val());
  GOVUK.formUtilities.getData(endpoint,formData,callbackSuccess,callbackFailure);

}

function showResultBanner(previousUAN, status)
{
  'use strict';

  var callbackSuccess = function(response){

    // display applicant name
    $('#previous-applicant-name').text(response.data.name);

    // show result banner
    $('#previous-status-' + status).removeClass('hidden');

  };

  var callbackFailure = function(jqXHR){
    // perform error functionality

    // redirect to error page
    // setTimeout(function(){ $('#wait').hide(); window.location = "error.html";}, 1000);

  };

  // get application details
  // post the data to the server
  var endpoint = GOVUK.appConfig.getApplicationDetail + previousUAN;
  GOVUK.formUtilities.getData(endpoint,formData,callbackSuccess,callbackFailure);


}
