import { ActionList, Button } from "@primer/react";
import { useStateMachine } from "little-state-machine";
import { isEmpty, map } from 'ramda';
import React, { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { GithubRepo, SortableGithubRepo } from "../../../global";
import { getRepos } from "../../../services/github";
import { List } from "../../../shared";
import { updateAction } from "../../../state/update-action";

type FormValues = {
  username: string;
};

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

    // TODO - Set the order of the repos based on the order in state.repos in the promise chain
    getRepos(state.username, state.repos)
      .then(
        map((repo: GithubRepo) => ({ ...repo, chosen: false }))
      ).then(setUserRepos);
  }, [state.username, state.repos])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      Preview & Confirm
      <Button type="submit">Next</Button>
      <List SortableActionList={SortableActionList} userRepos={userRepos} setUserRepos={setUserRepos} state={state} />
    </form >
  )
}
