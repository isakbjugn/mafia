import * as React from 'react';
import { Html } from '@react-email/html';

type OneTimePasswordEmailProps = {
  name: string;
  otp: string;
}

export const OneTimePasswordEmail = ({ name, otp }: OneTimePasswordEmailProps) => {
  return (
    <Html>
      <h1>Hei, {name}!</h1>
      <p>Her er ditt engangspassord: {otp}</p>
      <p>Det er viktig at du ikke deler dette passordet med noen.</p>
    </Html>
  );
};
