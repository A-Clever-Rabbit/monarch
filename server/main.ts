import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor'

// Server Only
import '/imports/api/server'
// Shared
import '/imports/api/shared'

import {register} from '/imports/service-registry/services';
register();


Meteor.startup(() => {
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };
  if(Meteor.isProduction) {
    console.log(" ======================== ENV ========================");
    console.log(process.env);
    console.log(" ====================== END ENV ======================")
  }
});
