import { ActionList, Button, FormControl } from "@primer/react";
import React, { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";
import { getUserRepos } from "../../../services/github";
import { isNilOrEmpty } from 'ramda-extension';
import type { GithubRepo } from "../../../global";
import { sortReposByState } from "../../../shared/sort-repos-by-state";

type FormValues = {
  repos: string[]
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
  console.log('state', { state })
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

  useEffect(() => {
    async function fetchData() {
      if (!state.username) {
        return;
      }

      getUserRepos(state.username)
        .then((repos) => sortReposByState(repos, state.repos))
        .then(setUserRepos)
        .catch(console.error);
    }

    fetchData();
    return;
  }, [state.repos, state.username])

  const selectedRepos = getValues('repos');

  const visibleOptions = userRepos.filter(({ name }) => selectedRepos.includes(name))
  const hiddenOptions = userRepos.filter(({ name }) => !selectedRepos.includes(name))

  const toggle = useCallback((name: string) => {
    // when toggling a repo to be selected, need to append to the end of the list, not the beginning

    const newSelectedRepos = selectedRepos.includes(name)
      ? selectedRepos.filter((repoId) => repoId !== name)
      : [...selectedRepos, name];

    setValue('repos', newSelectedRepos);
  }, [selectedRepos, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" block>Set Repos</Button>
      <ActionList selectionVariant="multiple">
        <ActionList.Group title="Select Your Repositories To Display">
          {errors.repos &&
            <FormControl.Validation id="custom-input-validation" variant="error">
              {errors.repos && errors.repos.message}
            </FormControl.Validation>
          }
          {visibleOptions.map(option => (
            <ActionList.Item key={option.id} selected={true} onSelect={() => toggle(option.name)}>
              {option.name}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        <ActionList.Group
          selectionVariant={
            /** selectionVariant override on Group: disable selection if there are no options */
            hiddenOptions.length ? 'multiple' : false
          }
        >
          {hiddenOptions.map((option, index) => (
            <ActionList.Item key={option.id} selected={false} onSelect={() => toggle(option.name)}>
              {option.name}
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </form>
  )
}
