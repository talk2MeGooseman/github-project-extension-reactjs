import { ActionList, Button, FormControl } from '@primer/react'
import { useStateMachine } from 'little-state-machine'
import { useCallback, useEffect } from 'react'
import { type Resolver, type ResolverResult, useForm, useWatch } from 'react-hook-form'
import { useQuery } from 'urql'

import type { GithubRepository } from '../../../gql'
import { GithubUsersRepositoriesQuery } from '../../../shared'
import { sortReposByState } from '../../../shared/sort-repos-by-state'
import { updateAction } from '../../../state/update-action'

type FormValues = {
  repos: string[]
}

const resolver: Resolver<FormValues> = async (values): Promise<ResolverResult<FormValues>> => {
  if (!values.repos || values.repos.length === 0) {
    return {
      values: {},
      errors: {
        repos: {
          type: 'required',
          message: 'You must select at least one repository.',
        },
      },
    }
  }

  return { values, errors: {} }
}

// Order-sensitive on purpose: it mirrors the deep equality the saved config
// is compared with, and repo order is meaningful downstream (step three).
const arraysEqualInOrder = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index])

export const StepTwo = () => {
  const { actions, state } = useStateMachine({ actions: { updateAction } })
  const {
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      repos: [],
    },
    resolver,
  })

  const [{ data, fetching }] = useQuery({
    query: GithubUsersRepositoriesQuery,
    variables: {
      username: state.username,
    },
    pause: !state.username,
  })

  const onSubmit = (formData: FormValues) => {
    actions.updateAction(formData)
  }

  useEffect(() => {
    reset({
      repos: state.repos,
    })
  }, [data?.github?.usersRepositories, reset, state.repos])

  const selectedRepos = useWatch({ control, name: 'repos' })

  const toggle = useCallback(
    (name: string) => {
      const newSelectedRepos = selectedRepos.includes(name)
        ? selectedRepos.filter((selectedRepo) => selectedRepo !== name)
        : [...selectedRepos, name]

      setValue('repos', newSelectedRepos)
    },
    [selectedRepos, setValue],
  )

  if (fetching) {
    return <div>Loading...</div>
  }

  const githubRepos: GithubRepository[] = (data?.github?.usersRepositories?.repositories ?? [])
    .filter((repo) => repo != null)

  const filterSelected = githubRepos.filter(({ nameWithOwner }) =>
    selectedRepos.includes(nameWithOwner),
  )
  const visibleOptions = sortReposByState(filterSelected, selectedRepos)
  const hiddenOptions = githubRepos.filter(
    ({ nameWithOwner }) => !selectedRepos.includes(nameWithOwner),
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        disabled={arraysEqualInOrder(selectedRepos, state.repos)}
        variant="primary"
        block
      >
        Set Repos
      </Button>
      <ActionList selectionVariant="multiple" role="listbox" aria-label="Your GitHub repositories">
        <ActionList.Group>
          <ActionList.GroupHeading>Select Your Repositories To Display</ActionList.GroupHeading>
          {errors.repos && (
            <FormControl.Validation id="custom-input-validation" variant="error">
              {errors.repos && errors.repos.message}
            </FormControl.Validation>
          )}
          {visibleOptions.map((option) => (
            <ActionList.Item
              key={option.id}
              selected={true}
              onSelect={() => toggle(option.nameWithOwner)}
            >
              {option.nameWithOwner}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        <ActionList.Group selectionVariant={hiddenOptions.length ? 'multiple' : false}>
          {hiddenOptions.map((option) => (
            <ActionList.Item
              key={option.id}
              selected={false}
              onSelect={() => toggle(option.nameWithOwner)}
            >
              {option.nameWithOwner}
            </ActionList.Item>
          ))}
        </ActionList.Group>
      </ActionList>
    </form>
  )
}
