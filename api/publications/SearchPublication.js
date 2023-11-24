// server/publications.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { PostsCollection } from '../collections/posts.collection';
import { AlbumsCollection } from '../collections/AlbumsCollection';
import { CategoriesCollection } from '../collections/categories.collection';

// Ensure database indexes
PostsCollection._ensureIndex({ title: 'text' });
AlbumsCollection._ensureIndex({ caption: 'text' });
CategoriesCollection._ensureIndex({ name: 'text' });

Meteor.publish('searchAll', function(searchTerm) {
  check(searchTerm, String);

  if (!searchTerm.trim()) {
    return this.ready();
  }

  const regex = new RegExp(searchTerm, 'i');

  return [
    PostsCollection.find({ title: regex }, { limit: 10 }),
    AlbumsCollection.find({ caption: regex }, { limit: 10 }),
    CategoriesCollection.find({ name: regex }, { limit: 10 })
  ];
});
