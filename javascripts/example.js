// scripts and functions specifically for the example page

// do not erase - helper for JSLint
/*jslint formUtilities: true */

var thisFormInstance = $('#example_form'),
    formData,
    templates,
    validApplicationData1,
    validApplicationData2,
    parsleyForm;


$(document).ready(function(){
  'use strict';

  $('.error-summary').hide();
  $('.error-summary').removeClass('hidden');

  // attach parsley validation to the form
  parsleyForm = thisFormInstance.parsley({
    excluded: 'input[type=button], input[type=submit], input[type=reset]',
    focus:"none"
  });

  $('swapdata').click(function(){
    changeData();
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
    hideErrorSummary();

    submitForm();

    return false;
  });


  // render some json data to the screen via nunjucks
  var testData = {
    "variable1":"Nunjucks variable 1",
    "variable2":"Nunjucks variable 2",
    "variable3":"Nunjucks variable 3"
  };


  validApplicationData1 = {
        "status": "success",
        "data": {
            "id": "1",
            "uan": "1234-1234-1234-1234",
            "name": "Joe Bloggs",
            "passportNo": "123456789",
            "status": "GCS7",
            "emailAddress": "user1@homeoffice.gov.uk",
            "policeRegistration": false,
            "sponsor": "Sheffield University",
            "studyAddress": "Western Bank, Sheffield, South Yorkshire S10 2TN"
        }
    };

  validApplicationData2 = {
        "status": "success",
        "data": {
            "id": "1",
            "uan": "5678-5678-5678-5678",
            "name": "Jane Doe",
            "passportNo": "987645321",
            "status": "GCS7",
            "emailAddress": "user1@homeoffice.gov.uk",
            "policeRegistration": true,
            "sponsor": "Sheffield University",
            "studyAddress": "Western Bank, Sheffield, South Yorkshire S10 2TN"
        }
    };

  // get nunjucks templates and compile them
  templates = GOVUK.formUtilities.compileNunjucksTemplates();

  // render the templates
  GOVUK.formUtilities.renderNunjucksTemplate('applicant-details-template',validApplicationData1,templates);
  GOVUK.formUtilities.renderNunjucksTemplate('test-template',testData,templates);
  
});

function changeData()
{
  'use strict';
  GOVUK.formUtilities.renderNunjucksTemplate('applicant-details-template',validApplicationData2,templates);
}


function hideErrorSummary()
{
  'use strict';
  $('#form-error-message').hide();
  $('#error-summary').hide();

  // hide from screenreader
  $('#error-summary').attr('aria-expanded', 'false');
  $('#error-summary').attr('aria-hidden', 'true');
}


// validate and send if no problems
function submitForm()
{
  'use strict';

  // get the data from the form as a JSON object
  formData = JSON.stringify(GOVUK.formUtilities.formToJSON($("form")));

  var callbackSuccess = function(response){      
    // response should contain the transaction ID
    if(response.id !== null && response.id !== undefined && response.id !== "")
    {
      var transactionId = response.id;

      // replace the transaction id in the on screen text
      var transactionText = $('#transaction-id').html();
      transactionText.replace("~~~transaction-id~~~",transactionId);
      //$('#transaction-id').html(newText);

    }
    
    // do success actions


  };

  var callbackFailure = function(jqXHR){
    // perform error functionality

    // redirect to error page
    // setTimeout(function(){ $('#wait').hide(); window.location = "error.html";}, 1000);

  };

  // post the data to the server
  GOVUK.formUtilities.postData(formData,'/controller',callbackSuccess,callbackFailure,'application/json');

}

