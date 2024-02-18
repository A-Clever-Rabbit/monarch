import React from 'react';
import { Hello } from '/imports/client/ui/components/Hello';
import { Info } from '/imports/client/ui/features/Info';

const Index = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
  </div>
);

export default Index;
