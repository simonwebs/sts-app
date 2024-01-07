// Import necessary modules
import { Mongo } from 'meteor/mongo';

// Create Followers collection
export const Followers = new Mongo.Collection('followers');
