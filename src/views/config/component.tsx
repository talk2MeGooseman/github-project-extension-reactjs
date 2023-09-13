import React, { useEffect } from 'react';
import { BaseStyles, ThemeProvider, Box, SplitPageLayout, Text } from '@primer/react'
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

  useEffect(() => {
    if (fetching) {
      return;
    }

    actions.updateAction({
      username: getUsername(data) || '',
      repos: getRepos(data) || [],
      fetching: false,
    });
  }, [actions, data, fetching]);

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
            <SplitPageLayout.Header padding="condensed">
              <Text as='p' sx={{fontWeight: 'bold'}}>
                Thank you for installing the GitHub Projects extension! Getting started is easy, just follow the steps below.
              </Text>
              <Text as='ol'>
                <Text as='li'>
                  Enter your GitHub username and click 'Set Username'.
                </Text>
                <Text as='li'>
                  Select the repositories you want to use and click 'Set Repos'.
                </Text>
                <Text as='li'>
                  In the preview pane, drag and drop the repositories to the order you want them to appear to your viewers and click 'Set Order'.
                </Text>
              </Text>

              <p className='text-italic'>That's it! You can always come back to select a new username or repository.</p>
            </SplitPageLayout.Header>
            <SplitPageLayout.Pane resizable width='large'>
              <StepOne />
              <hr />
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
