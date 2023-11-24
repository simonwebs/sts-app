// @ts-nocheck
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// Create the Teachers collection
export const TeachersCollection = new Mongo.Collection('teachers');

// Define the schema for Teachers
export const TeacherSchema = new SimpleSchema({
  _id: String,
  authorId: String,
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert && !this.isSet) return new Date();
    },
  },
  qualifications: {
    type: String,
    optional: false,
  },
   dateOfBirth: {
    type: Date,
    optional: false,
    custom () {
      const date = this.value;
      if (date > new Date()) {
        return SimpleSchema.ErrorTypes.MAX_DATE;
      }
    },
  },
   image: {
    type: String,
    required: true,
  },
   teacherName: {
    type: String,
    optional: false,
  },
  yearsOfExperience: {
    type: Number,
    optional: false,
  },
  address: {
    type: String,
    optional: false,
  },
  gender: {
    type: String,
    allowedValues: ['male', 'female', 'other'],
    optional: false,
  },
    language: {
  type: String,
  allowedValues: ['English', 'French', 'Both'],
  optional: false,
},
role: {
  type: String,
  allowedValues: ['Cook', 'Teacher', 'Janitor', 'Security'],
  optional: false,
},
isApproved: { 
  type: Boolean,
  optional: false,
  defaultValue: false,
},
  telephone: {
    type: String,
    optional: false,
  },
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
 'emails.$.address': {
  type: String,
  optional: false,
  regEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // This is a simplified email regex
},

  'emails.$.verified': {
    type: Boolean,
    optional: false,
    defaultValue: false,
  },
  userId: {
    type: String,
    optional: false,
  },
});

// Attach the schema to the Teachers collection
TeachersCollection.attachSchema(TeacherSchema);
