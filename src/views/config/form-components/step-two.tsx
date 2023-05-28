import { ActionList, Button, FormControl } from "@primer/react";
import React, { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";
import { getUserRepos } from "../../../services/github";
import { isNilOrEmpty } from 'ramda-extension';

type GithubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

type FormValues = {
  repos: Number[]
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.repos ? values : [],
    errors: isNilOrEmpty(values.repos)
      ? {
        repos: {
          type: 'required',
          message: 'You must select at least one repository.',
        },
      }
      : {},
  };
};

export const StepTwo = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const { setValue, handleSubmit, formState: { errors }, getValues, watch } = useForm<FormValues>({
    defaultValues: {
      repos: state.repos,
    },
    resolver
  });
  watch('repos')
  const [userRepos, setUserRepos] = useState<GithubRepo[]>([]);
  const onSubmit = (data) => {
    actions.updateAction(data);
  };

  // Fetch the user's repos from GitHub
  useEffect(() => {
    async function fetchData() {
      if (!state.username) {
        return;
      }

      getUserRepos(state.username)
        .then(setUserRepos)
    }

    fetchData();
    console.log('fetched')

    return;
  }, [state.username])

  const selectedRepos = getValues('repos');

  const visibleOptions = userRepos.filter(({ id }) => selectedRepos.includes(id))
  const hiddenOptions = userRepos.filter(({ id }) => !selectedRepos.includes(id))

  const toggle = useCallback((id: number) => {
    const newSelectedRepos = selectedRepos.includes(id)
      ? selectedRepos.filter((repoId) => repoId !== id)
      : [...selectedRepos, id];

    setValue('repos', newSelectedRepos);
  }, [selectedRepos, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Next</Button>
      <ActionList selectionVariant="multiple">
        <ActionList.Group title="Selected Repositories">
          {errors.repos &&
            <FormControl.Validation id="custom-input-validation" variant="error">
              {errors.repos && errors.repos.message}
            </FormControl.Validation>
          }
          {visibleOptions.map(option => (
            <ActionList.Item key={option.id} selected={true} onSelect={() => toggle(option.id)}>
              {option.name}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        <ActionList.Group
          title="Unselected Repositories"
          selectionVariant={
            /** selectionVariant override on Group: disable selection if there are no options */
            hiddenOptions.length ? 'multiple' : false
          }
        >
          {hiddenOptions.map((option, index) => (
            <ActionList.Item key={option.id} selected={false} onSelect={() => toggle(option.id)}>
              {option.name}
            </ActionList.Item>
          ))}
          {hiddenOptions.length === 0 && <ActionList.Item disabled>No hidden fields</ActionList.Item>}
        </ActionList.Group>
      </ActionList>
    </form>
  )
}
