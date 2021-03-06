// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

// Create a function for the Chrome i18n API if it doesn't exist the allow the
// page to be tested as a normal browser page.
if (!chrome.i18n) {
  chrome.i18n = {
    getMessage: function(name) {
      return name;
    }
  };
}

var button = document.getElementById('mount');

var internationalise = function() {
  var selector = 'data-message';
  var elements = document.querySelectorAll('[' + selector + ']');

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    var messageID = element.getAttribute(selector);
    var messageText = chrome.i18n.getMessage(messageID);

    switch(element.tagName.toLowerCase()) {
      case 'paper-input':
      case 'paper-button':
        element.setAttribute('label', messageText);
        break;
      case 'paper-toast':
        element.setAttribute('text', messageText);
        break;
      case 'h1':
      case 'title':
        element.innerText = messageText;
        break;
    }
  }
};

internationalise();

button.addEventListener('click', function(event) {
  event.preventDefault();

  button.setAttribute('disabled', 'true');

  document.getElementById('toast-mount-attempt').show();

  var request = {
    type: 'mount'
  };

  // Add values from your form fields to the request object here that the
  // background script can then use when mounting the new instance.

  chrome.runtime.sendMessage(request, function(response) {
    if (response.success) {
      document.getElementById('toast-mount-success').show();

      window.setTimeout(function() {
        window.close();
      }, 2000);
    } else {
      document.getElementById('toast-mount-fail').show();
      button.removeAttribute('disabled');
    }
  });
});
