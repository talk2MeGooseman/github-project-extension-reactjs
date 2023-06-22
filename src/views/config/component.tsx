import React from 'react';
import { BaseStyles, ThemeProvider, Box, SplitPageLayout } from '@primer/react'
import { getUserRepos } from '../../services/github';
import { StepOne, StepThree, StepTwo } from './form-components';
import {
  StateMachineProvider,
  createStore,
} from 'little-state-machine';

createStore({
  username: undefined,
  repos: [],
},
  {
    persist: 'none'
  },
);

export const Config = () => {
  return (
    <StateMachineProvider>
      <ThemeProvider colorMode="day">
        <BaseStyles>
          <Box>
            <SplitPageLayout>
              <SplitPageLayout.Header>
                <StepOne />
              </SplitPageLayout.Header>
              <SplitPageLayout.Pane>
                <StepTwo />
              </SplitPageLayout.Pane>
              <SplitPageLayout.Content>
                <StepThree />
              </SplitPageLayout.Content>
            </SplitPageLayout>
          </Box>
        </BaseStyles>
      </ThemeProvider>
    </StateMachineProvider>
  );
}
