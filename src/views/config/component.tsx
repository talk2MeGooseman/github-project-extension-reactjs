import { BaseStyles, SplitPageLayout, Text, ThemeProvider } from '@primer/react'
import { useStateMachine } from 'little-state-machine'
import { useEffect } from 'react'
import { useQuery } from 'urql'

import { ChannelQuery } from '../../shared'
import { updateAction } from '../../state/update-action'
import { StepOne, StepThree, StepTwo } from './form-components'

export const Config = () => {
  const { actions, state } = useStateMachine({ actions: { updateAction } })
  const [{ data, error, fetching }] = useQuery({
    query: ChannelQuery,
  })

  useEffect(() => {
    if (fetching) {
      return
    }

    const config = data?.channel?.githubProjectsConfig

    actions.updateAction({
      username: config?.username || '',
      repos: config?.repos?.filter((repo) => repo != null) || [],
      fetching: false,
    })
  }, [actions, data, fetching])

  if (state.fetching) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <ThemeProvider colorMode="light">
      <BaseStyles>
        <SplitPageLayout>
          <SplitPageLayout.Header padding="condensed">
            <Text as="p" weight="semibold">
              Thank you for installing the GitHub Projects extension! Getting started is easy,
              just follow the steps below.
            </Text>
            <Text as="ol">
              <Text as="li">Enter your GitHub username and click 'Set Username'.</Text>
              <Text as="li">
                Select the repositories you want to use and click 'Set Repos'.
              </Text>
              <Text as="li">
                In the preview pane, drag and drop the repositories to the order you want them to
                appear to your viewers and click 'Save and Display'.
              </Text>
            </Text>

            <p>
              <em>That's it! You can always come back to select a new username or repository.</em>
            </p>
          </SplitPageLayout.Header>
          <SplitPageLayout.Pane resizable width="large">
            <StepOne />
            <hr />
            <StepTwo />
          </SplitPageLayout.Pane>
          <SplitPageLayout.Content>
            <StepThree />
          </SplitPageLayout.Content>
        </SplitPageLayout>
      </BaseStyles>
    </ThemeProvider>
  )
}
