import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'

import {RoleCollection} from '/imports/infrastructure/db/role/role'
import {UserCollection} from '/imports/infrastructure/db/user/user'

Meteor.publish('userData', function () {
  if (this.userId) {
    const user = UserCollection.findOne({ _id: this.userId });

    if(!user) {
      throw new Meteor.Error('user-not-found', 'User not found');
    }

    const publications: Mongo.Cursor<any>[] = [
      UserCollection.find({ _id: this.userId }, {
        fields: {
          emails: 1,
          roleIds: 1
        }
      }),
    ];


    if(user.roleIds && user.roleIds.length > 0) {
      const rolesCursor = RoleCollection.find({ _id: { $in: user.roleIds } });
      publications.push(rolesCursor);
    }

    return publications;
  } else {
    this.ready();
  }
});
