import { ActionList, Button } from "@primer/react";
import { useStateMachine } from "little-state-machine";
import { isEmpty, map } from 'ramda';
import React, { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GithubRepo, SortableGithubRepo } from "../../../global";
import { getRepos } from "../../../services/github";
import { List, UpsertGithubProjectsConfigMutation } from "../../../shared";
import { updateAction } from "../../../state/update-action";
import { useMutation } from "urql";

type FormValues = {
  username: string;
};

const SortableActionList = forwardRef<any, any>((props, ref) => {
  return <ActionList showDividers ref={ref}>{props.children}</ActionList>;
});

export const StepThree = () => {
  const [userRepos, setUserRepos] = React.useState<SortableGithubRepo[]>([]);
  const { actions, state } = useStateMachine({ updateAction });
  const { handleSubmit } = useForm<FormValues>({
    defaultValues: { username: state.username }
  });
  const [updateConfigResult, updateConfig] = useMutation(UpsertGithubProjectsConfigMutation);

  const onSubmit = (data: FormValues) => {
    const repos = userRepos.map((repo) => repo.name);
    actions.updateAction({ repos });

    if (!state.username) {
      return;
    }

    updateConfig({
       username: state.username,
       repos: repos,
    }).then(result => {
      console.log({result});
    });
  };

  useEffect(() => {
    if (!state.username || isEmpty(state.repos)) {
      return
    }

    getRepos(state.username, state.repos)
      .then(
        (repos: GithubRepo[]) => repos.sort((a, b) => state.repos.indexOf(a.name) - state.repos.indexOf(b.name))
      )
      .then(
        map((repo: GithubRepo) => ({ ...repo, chosen: false }))
      )
      .then(setUserRepos);
  }, [state.username, state.repos])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      Preview & Confirm
      <p>{state.repos.join(', ')}</p>
      <Button type="submit">Save</Button>
      <List SortableActionList={SortableActionList} userRepos={userRepos} setUserRepos={setUserRepos} state={state} />
    </form >
  )
}
