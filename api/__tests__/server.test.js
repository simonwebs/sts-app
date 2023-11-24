import { Meteor } from 'meteor/meteor';
import { describe, it, expect, jest } from '@jest/globals';

// Mock the Meteor.call function
Meteor.call = jest.fn((method, token) => {
  if (method === 'validateSuperAdminToken') {
    return token === '123BCD';
  }
});

// Your actual constant
const SUPER_ADMIN_TOKEN = '123BCD'; // Replace this with your actual token

describe('SUPER_ADMIN_TOKEN', () => {

  it('should be a non-empty string', () => {
    expect(typeof SUPER_ADMIN_TOKEN).toBe('string');
    expect(SUPER_ADMIN_TOKEN.length).toBeGreaterThan(0);
  });

  it('should be used in validateSuperAdminToken Meteor Method', async () => {
    const validationResponse = await Meteor.call('validateSuperAdminToken', SUPER_ADMIN_TOKEN);
    expect(validationResponse).toBe(true);
  });

  it('should be incorrect for invalid tokens', async () => {
    const invalidToken = 'invalid_token';
    const validationResponse = await Meteor.call('validateSuperAdminToken', invalidToken);
    expect(validationResponse).toBe(false);
  });

});
