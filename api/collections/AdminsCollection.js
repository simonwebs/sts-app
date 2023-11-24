import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const AdminsCollection = new Mongo.Collection('admins');

const AdminSchema = new SimpleSchema({
  _id: { type: String, optional: true },
  email: { type: String },
  username: { type: String },
  password: { type: String },
  role: { type: String },
  permissions: { type: Array, defaultValue: [] },
  'permissions.$': { type: String },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) return new Date();
    }
  }
});

AdminsCollection.attachSchema(AdminSchema);