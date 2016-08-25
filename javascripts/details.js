

// do not erase - helper for JSLint
/*jslint formUtilities: true */

var thisFormInstance = $('#details'),
    formData,
    parsleyForm,
    applicationUAN,
    applicationData;


$(document).ready(function(){
  'use strict';

  $('.error-summary').hide();
  $('.error-summary').removeClass('hidden');

  // attach parsley validation to the form
  parsleyForm = thisFormInstance.parsley({
    excluded: 'input[type=button], input[type=submit], input[type=reset]',
    focus:"none"
  });

  applicationUAN = GOVUK.formUtilities.getQueryVariable('uan');
  //console.log('uan:' + applicationUAN);
  getApplicationDetails(applicationUAN);



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
  thisFormInstance.parsley().on('form:error', function() {
    //console.log('form error');

    // construct error display
    GOVUK.formUtilities.showErrorSummary();
    
  });


  // what to do when form validates successfully
  thisFormInstance.parsley().on('form:submit', function() {
    //console.log('form success');
    GOVUK.formUtilities.hideErrorSummary();

    submitForm();

    return false;
  });
  
});


// on page load
function getApplicationDetails(uan)
{
  'use strict';

  var callbackSuccess = function(response){

    applicationData = response.data;

    // fill in page details
    // TODO: replace this with nunjucks rendering
    $('#uan').text(applicationUAN);
    $('#name').text(applicationData.name);
    $('#passportNo').text(applicationData.passportNo);
    $('#sponsor').text(applicationData.sponsor);
    if(applicationData.policeRegistration){
      $('#policeRegistration').text('Yes');
    } else {
      $('#policeRegistration').text('No');
    }

    // show details
    $('#applicant-details').removeClass('hidden');

    
  };

  var callbackFailure = function(jqXHR){
    //console.log('fail');
    // perform error functionality

    jqXHR='';

    // redirect to error page
    // setTimeout(function(){ $('#wait').hide(); window.location = "error.html";}, 1000);

  };

  // post the data to the server
  //var endpoint = '/application/' + uan;
  var endpoint = GOVUK.appConfig.getApplicationDetail + uan;
  GOVUK.formUtilities.getData(endpoint,'',callbackSuccess,callbackFailure);

}


// validate and send ajax request to server if no problems
function submitForm()
{
  'use strict';

  var callbackSuccess = function(response){
    
    console.log(response);
    // redirect to page with UAN in querystring
    //var destUrl = 'details.html?uan=' + $('#id-uan').val();
    //document.location.href = (destUrl);

    if (response.status === 'success')
    {
      // success - redirect to search page with UAN in querystring
      // redirect to page with UAN in querystring
      var destUrl = 'index.html?uan=' + encodeURI(applicationUAN) + '&status=success';
      document.location.href = (destUrl);

    } else {
      // TODO: unhappy paths handling
      var x=0;
      x=1;
    }

  };

  var callbackFailure = function(jqXHR){
    // perform error functionality

    //console.log(jqXHR);

    // redirect to error page
    // setTimeout(function(){ $('#wait').hide(); window.location = "error.html";}, 1000);

  };

  // post the data to the server
  // construct our data object
  formData = {
    "template": "GRANT",
    "fields": {
      "courseTitle": $('#courseTitle').val(),
      "studyAddress": $('#studyAddress').val(),
      "courseLevel": $('#courseLevel').val()
    },
    "uan": applicationUAN
  };

  formData = JSON.stringify(formData);

  // var endpoint = '/message/send';
  var endpoint = GOVUK.appConfig.postEmailRequest;
  GOVUK.formUtilities.postData(formData,endpoint,callbackSuccess,callbackFailure,'application/json');

}

