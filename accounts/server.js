import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'


if(Meteor.isServer){

Meteor.publish('userData', function (userId) {
    return Meteor.users.find({ _id: userId }, {
      fields: { permission:1 }
    });

});
}