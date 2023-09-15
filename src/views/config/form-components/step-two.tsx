import { ActionList, Button, FormControl } from "@primer/react";
import React, { useCallback, useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";
import { isNilOrEmpty } from 'ramda-extension';
import { sortReposByState } from "../../../shared/sort-repos-by-state";
import { useQuery } from "urql";
import { GithubUsersRepositoriesQuery } from "../../../shared";
import { GithubRepository } from "../../../gql";
import { equals } from "ramda";

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
  const { setValue, handleSubmit, reset, formState: { errors }, getValues, watch } = useForm<FormValues>({
    defaultValues: {
      repos: []
    },
    resolver
  });

  const [{ data, fetching }] = useQuery({
    query: GithubUsersRepositoriesQuery,
    variables: {
      username: state.username
    },
    pause: !state.username,
  })

  const onSubmit = (formData) => {
    actions.updateAction(formData);
  };

  useEffect(() => {
    console.log('resetting')
    reset({
      repos: state.repos
    })
  }, [data?.github?.usersRepositories, reset, state.repos])

  const selectedRepos = getValues('repos');
  watch('repos');

  const toggle = useCallback((name: string) => {
    const newSelectedRepos = selectedRepos.includes(name)
      ? selectedRepos.filter((selectedRepo) => selectedRepo !== name)
      : [...selectedRepos, name];

    setValue('repos', newSelectedRepos);
  }, [selectedRepos, setValue])

  if (fetching) {
    return <div>Loading...</div>;
  }

  const githubRepos = data?.github?.usersRepositories?.repositories || [] as GithubRepository[];

  const filterSelected = githubRepos.filter(({ nameWithOwner }) => selectedRepos.includes(nameWithOwner))
  const visibleOptions = sortReposByState(filterSelected, selectedRepos);
  const hiddenOptions = githubRepos.filter(({ nameWithOwner }) => !selectedRepos.includes(nameWithOwner))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" disabled={equals(selectedRepos, state.repos)} variant="primary" block>Set Repos</Button>
      <ActionList selectionVariant="multiple">
        <ActionList.Group title="Select Your Repositories To Display">
          {errors.repos &&
            <FormControl.Validation id="custom-input-validation" variant="error">
              {errors.repos && errors.repos.message}
            </FormControl.Validation>
          }
          {visibleOptions.map(option => (
            <ActionList.Item key={option.id} selected={true} onSelect={() => toggle(option.nameWithOwner)}>
              {option.nameWithOwner}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        <ActionList.Group
          selectionVariant={
            hiddenOptions.length ? 'multiple' : false
          }
        >
          {hiddenOptions.map((option, index) => (
            <ActionList.Item key={option.id} selected={false} onSelect={() => toggle(option.nameWithOwner)}>
              {option.nameWithOwner}
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </form>
  )
}
