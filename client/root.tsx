import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import {App} from '/imports/client/app'

const container = document.getElementById('react-target');
const root = createRoot(container!);

Meteor.startup(() => {
    root.render(<App />);
});
