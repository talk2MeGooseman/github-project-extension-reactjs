import { Button, Heading } from '@primer/react'
import { useStateMachine } from 'little-state-machine'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { List, UpsertGithubProjectsConfigMutation } from '../../../shared'
import { updateAction } from '../../../state/update-action'
import classes from './form.module.css'

export type Step3FormValues = {
  username: string
  repos: string[]
}

export const StepThree = () => {
  const { actions, state } = useStateMachine({ actions: { updateAction } })
  const {
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { defaultValues },
  } = useForm<Step3FormValues>({
    defaultValues: {
      username: state.username,
      repos: state.repos,
    },
  })

  useEffect(() => {
    if (defaultValues?.repos !== state.repos || defaultValues?.username !== state.username) {
      reset({
        username: state.username,
        repos: state.repos,
      })
    }
  }, [defaultValues?.repos, defaultValues?.username, reset, state.repos, state.username])

  const [, updateConfig] = useMutation(UpsertGithubProjectsConfigMutation)

  const onSubmit = (data: Step3FormValues) => {
    actions.updateAction({ repos: data.repos })

    updateConfig({
      username: data.username,
      repos: data.repos,
    })
  }

  const repos = getValues('repos')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit" block className={classes.submitButton} variant="primary">
        Save and Display
      </Button>
      <Heading as="h2" className={classes.orderHeading}>
        Drag and drop the repositories to change the order in which they will be displayed.
      </Heading>
      <div className={classes.listContainer}>
        <List
          disableSorting={false}
          setValue={setValue}
          repos={repos}
          username={getValues('username')}
        />
      </div>
    </form>
  )
}
