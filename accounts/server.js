import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
	//criação do usuario root
	/*
    const userId = Accounts.createUser({
      email:              'root@ufmt.br',
      password:           'root123',
    });

    Meteor.users.update({ _id: userId }, {
      $set:
      { name:             Default.rootUser.name,
        gradProgram:      Default.rootUser.gradProgram
      }
    });
    */
     
     //Meteor.loginWithPassword('root@ufmt.br','root123')
})