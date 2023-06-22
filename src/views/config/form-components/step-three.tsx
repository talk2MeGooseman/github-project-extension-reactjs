import { ActionList, Avatar, Box, Button, Header, LabelGroup, PageLayout, Token } from "@primer/react";
import { RepoIcon, StarIcon } from '@primer/styled-octicons';
import { useStateMachine } from "little-state-machine";
import { isEmpty, isNotNil, map, prop } from 'ramda';
import React, { forwardRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GithubRepo } from "../../../global";
import { getRepos } from "../../../services/github";
import { updateAction } from "../../../state/update-action";
import { ReactSortable } from "react-sortablejs";

type FormValues = {
  username: string;
};

type SortableGithubRepo = GithubRepo & { chosen: boolean };

// Panel extension is 318x500px (width x height)
const SortableActionList = forwardRef<any, any>((props, ref) => {
  return <ActionList showDividers ref={ref}>{props.children}</ActionList>;
});

export const StepThree = () => {
  const [userRepos, setUserRepos] = React.useState<SortableGithubRepo[]>([]);
  const { actions, state } = useStateMachine({ updateAction });
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { username: state.username }
  });

  const onSubmit = (data: FormValues) => {
    // actions.updateAction(data);
  };

  useEffect(() => {
    if (!state.username || isEmpty(state.repos)) {
      return
    }

    getRepos(state.username, state.repos)
      .then(
        map((repo: GithubRepo) => ({ ...repo, chosen: false }))
      ).then(setUserRepos);
  }, [state.username, state.repos])


  const renderItem = useCallback(
    (repo: SortableGithubRepo) => {
      return (
        <ListItem key={repo.name} {...repo} />
      )
    },
    [],
  )
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
            <ReactSortable
              tag={SortableActionList}
              list={userRepos}
              setList={setUserRepos}
              animation={250}
            >
              {userRepos.map(renderItem)}
            </ReactSortable>
          </PageLayout.Content>
        </PageLayout>
      </Box>
    </form >
  )
}


const ListItem = ({ name, description, language, stargazers_count, chosen }: SortableGithubRepo) => {
  const style = {};

  if (chosen) {
    style['backgroundColor'] = 'bg.primary';
  }

  return (<ActionList.Item
    active={chosen}
    sx={{
      minHeight: '95px',
      cursor: 'move',
      hover: {}
    }}>
    <ActionList.LeadingVisual>
      <RepoIcon />
    </ActionList.LeadingVisual>
    {name}
    <ActionList.Description variant='block'>
      <div>
        {description}
      </div>
      <LabelGroup>
        { isNotNil(language) && <Token text={language} /> }
        <Token text={stargazers_count} leadingVisual={StarIcon} />
      </LabelGroup>
    </ActionList.Description>
  </ActionList.Item>);
}
