import React, { useEffect } from 'react';
import { BaseStyles, ThemeProvider, Box, SplitPageLayout } from '@primer/react'
import { StepOne, StepThree, StepTwo } from './form-components';
import {
  useStateMachine,
} from 'little-state-machine';
import { useQuery } from 'urql';
import { ChannelQuery } from '../../shared';
import { dotPath } from 'ramda-extension'
import { updateAction } from '../../state/update-action';

const getUsername = dotPath('channel.githubProjectsConfig.username');
const getRepos = dotPath('channel.githubProjectsConfig.repos');

export const Config = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const [{ data, error, fetching }] = useQuery({
    query: ChannelQuery,
  });

  const username = getUsername(data);
  const repos = getRepos(data);

  useEffect(() => {
    if (!username || !repos || fetching) {
      return;
    }

    actions.updateAction({
      username: getUsername(data),
      repos: getRepos(data),
      fetching: false,
    });
  }, [actions, data, fetching, repos, username]);

  if (state.fetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
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
  );
}
