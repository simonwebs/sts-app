import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

// Create the context with a default value
export const UserContext = createContext(null);
