// mock data for use during development

(function(global) {
  "use strict";
  var $ = global.jQuery;
  var GOVUK = global.GOVUK || {};

  GOVUK.mockData = {
    validApplication: {
        "status": "success",
        "data": {
            "id": "1",
            "name": "Joe Bloggs",
            "passportNo": "123456789",
            "status": "GCS7",
            "emailAddress": "user1@homeoffice.gov.uk",
            "policeRegistration": false,
            "sponsor": "Sheffield University",
            "studyAddress": "Western Bank, Sheffield, South Yorkshire S10 2TN"
        }
    },
    validApplicationPolice: {
        "status": "success",
        "data": {
            "id": "2",
            "name": "Joe Bloggs",
            "passportNo": "123456789",
            "status": "GCS7",
            "emailAddress": "user1@homeoffice.gov.uk",
            "policeRegistration": true,
            "sponsor": "Sheffield University",
            "studyAddress": "Western Bank, Sheffield, South Yorkshire S10 2TN"
        }
    },
    validApplicationDependents: {
        "status": "success",
        "data": {
            "id": "2",
            "name": "Joe Bloggs",
            "passportNo": "123456789",
            "status": "GCS7",
            "emailAddress": "user1@homeoffice.gov.uk",
            "policeRegistration": true,
            "sponsor": "Sheffield University",
            "studyAddress": "Western Bank, Sheffield, South Yorkshire S10 2TN",
            "depdendents": [{
                "id": "3",
                "name": "Jane Bloggs",
                "passportNo": "123456789",
                "status": "GCS7",
                "policeRegistration": true,
                },
                {
                    "id": "4",
                    "name": "Paul Bloggs",
                    "passportNo": "123456789",
                    "status": "GCS7",
                    "policeRegistration": true,
                }

            ]
        }
    },
    successfulGrant: {
      "status": "success",
      "data": {
        "correlationId": "222",
        "message": null,
        "status": "delivered"
      }
    }

  };
global.GOVUK = GOVUK;
})(window);
