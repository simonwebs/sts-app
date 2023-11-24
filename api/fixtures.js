import { Meteor } from 'meteor/meteor';
import { CategoriesCollection } from './collections/categories.collection';

Meteor.startup(() => {
  // Check if the CategoriesCollection is empt
  if (CategoriesCollection.find().count() === 0) {
    // Insert some categories
    const categoriesData = [
      { name: 'Prophecy' },
      { name: 'Social' },
      { name: 'Gospel' },
      { name: 'Health' },
    ];

    categoriesData.forEach((category) => CategoriesCollection.insert(category));
  }
});
