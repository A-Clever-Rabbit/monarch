import { Meteor } from 'meteor/meteor';
import {ImagesCollection} from "/imports/infrastructure/db/uploads/uploads";

Meteor.publish('images', function () {
  return ImagesCollection.find().cursor;
});
