import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Analytics } from '../collections/Analytics';

Meteor.methods({
  'analytics.insert' () {
    const userAgent = this.connection.httpHeaders['user-agent'];
    const referrer = this.connection.httpHeaders.referer;
    const ip = this.connection.clientAddress;

    HTTP.get('https://ipinfo.io/' + ip + '/json', {}, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        const location = response.data.city + ', ' + response.data.region + ', ' + response.data.country;

        Analytics.insert({
          userAgent,
          referrer,
          location,
          createdAt: new Date(),
        });
      }
    });
  },
});
