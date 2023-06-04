import { Box, Button, PageLayout, Header, Avatar, ActionList, Label, LabelGroup } from "@primer/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";
import { getRepos } from "../../../services/github";
import { isEmpty } from 'ramda'
import { StarFillIcon } from '@primer/styled-octicons'

type FormValues = {
  username: string;
};

// Panel extension is 318x500px (width x height)

export const StepThree = () => {
  const [userRepos, setUserRepos] = React.useState([]);
  const { actions, state } = useStateMachine({ updateAction });
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { username: state.username }
  });

  const onSubmit = (data: FormValues) => {
    actions.updateAction(data);
  };

  useEffect(() => {
    if (!state.username || isEmpty(state.repos)) {
      return
    }

    getRepos(state.username, state.repos)
      .then((data) => {
        setUserRepos(data);
      });
  }, [state.username, state.repos])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      Preview & Confirm
      <Button type="submit">Next</Button>
      <Box sx={{ height: 500, width: 318, overflowY: 'auto', border: '1px solid', borderColor: 'border.default' }}>
        <Box>
          <Header sx={{
            position: 'sticky',
            top: 0,
            height: 64,
            zIndex: 1,
          }}>
            <Header.Item>
              <Header.Link href="#" sx={{ fontSize: 2 }}>
                <Avatar src="https://avatars.githubusercontent.com/primer" sx={{ mr: 2 }} />
                <span>{state.username}</span>
              </Header.Link>
            </Header.Item>
          </Header>
        </Box>
        <PageLayout padding='none'>
          <PageLayout.Content>
            <ActionList showDividers>
              {userRepos.map((repo: GithubRepo) => (
                <ActionList.Item sx={{ minHeight: '70px' }}>
                  <ActionList.LeadingVisual>
                    <Avatar src="https://github.com/mona.png" />
                  </ActionList.LeadingVisual>
                  {repo.name}
                  <ActionList.Description variant='block'>
                    <div>
                      {repo.description}
                    </div>
                    <div>
                      <LabelGroup>
                        <Label>{repo.language}</Label>
                        <Label><StarFillIcon size={16} /> {repo.stargazers_count}</Label>
                      </LabelGroup>
                    </div>
                  </ActionList.Description>
                </ActionList.Item>
              ))}
            </ActionList>
          </PageLayout.Content>
        </PageLayout>
      </Box>
    </form >
  )
}
