// CommonUserProfilesState.js
import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { UserProfiles } from '../../api/collections/UserProfiles';
import { UsersCollection } from '../../api/collections/UsersCollection';

export const useCommonUserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  useTracker(() => {
    const profilesHandler = Meteor.subscribe('userProfiles.all');
    const usersHandler = Meteor.subscribe('users.all'); // Assuming you have a publication for all users in UsersCollection

    console.log('Profiles handler ready:', profilesHandler.ready());
    console.log('Users handler ready:', usersHandler.ready());

    if (profilesHandler.ready() && usersHandler.ready()) {
      const profiles = UserProfiles.find({}).fetch();
      const users = UsersCollection.find({}, { fields: { image: 1, username: 1, status: 1, birthDate: 1 } }).fetch();

      console.log('Fetched profiles:', profiles);
      console.log('Fetched users:', users);

      // Merge the information from UserProfiles and UsersCollection based on userId
      const mergedProfiles = profiles.map((profile) => {
        const user = users.find((u) => u._id === profile.authorId);

        // Calculate age based on birthDate
        const birthDate = user?.birthDate;
        const age = birthDate ? Math.abs(new Date(Date.now() - new Date(birthDate).getTime()).getUTCFullYear() - 1970) : null;

        return { ...profile, ...user, age };
      });

      console.log('Merged profiles:', mergedProfiles);

      setUserProfiles(mergedProfiles);
    }
  }, []);

  console.log('Final userProfiles:', userProfiles);

  return userProfiles;
};
