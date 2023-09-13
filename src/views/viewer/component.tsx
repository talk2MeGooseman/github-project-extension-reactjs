import React from 'react';
import { List } from '../../shared';
import { useFetchUpdateState } from '../../shared/use-fetch-state';
import { useStateMachine } from 'little-state-machine';
import { updateAction } from '../../state/update-action';
import { BaseStyles, ThemeProvider } from '@primer/react';

export const Viewer = () => {
  const { state } = useStateMachine({ updateAction });
  useFetchUpdateState();

  console.log('state', state);
  if (state.fetching) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <List disableSorting state={state} />
      </BaseStyles>
    </ThemeProvider>
  )
}
