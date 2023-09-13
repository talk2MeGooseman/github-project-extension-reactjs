import { Button, Heading } from "@primer/react";
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import { List, UpsertGithubProjectsConfigMutation } from "../../../shared";
import { updateAction } from "../../../state/update-action";
import { useMutation } from "urql";
import React, { useEffect } from 'react'

export type Step3FormValues = {
  username: string;
  repos: string[];
};

export const StepThree = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const { handleSubmit, getValues, setValue, reset, formState: { defaultValues } } = useForm<Step3FormValues>({
    defaultValues: {
      username: state.username,
      repos: state.repos
    }
  });

  useEffect(() => {
    if(defaultValues?.repos !== state.repos || defaultValues?.username !== state.username) {
      reset({
        username: state.username,
        repos: state.repos
      })
    }
  }, [defaultValues?.repos, defaultValues?.username, reset, state.repos, state.username]);

  const [_updateConfigResult, updateConfig] = useMutation(UpsertGithubProjectsConfigMutation);

  const onSubmit = (data: Step3FormValues) => {
    actions.updateAction({ repos: data.repos });

    updateConfig({
       username: data.username,
       repos: data.repos,
    });
  };

  const repos = getValues('repos');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" block sx={{marginBottom: '1rem'}} variant="primary">Set Order</Button>
      <Heading sx={{fontSize: 1, mb: 2}}>Drag and drop the repositories to change the order in which they will be displayed.</Heading>
      <List disableSorting={false} setValue={setValue} repos={repos} username={getValues('username')} />
    </form >
  )
}
