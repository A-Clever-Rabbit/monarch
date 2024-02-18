import {Mongo} from 'meteor/mongo'
import {SettingDocument} from '/imports/domain/entities/setting/setting'
export const SettingsCollection = new Mongo.Collection<SettingDocument>('settings');
