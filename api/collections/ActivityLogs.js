// Import necessary modules
import { Mongo } from 'meteor/mongo';

// Create ActivityLogs collection
export const ActivityLogs = new Mongo.Collection('activityLogs');
