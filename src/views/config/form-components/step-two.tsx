import { ActionList, FormControl, TextInput } from "@primer/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";
import { getUserRepos } from "../../../services/github";
import { mergeLeft, map } from "ramda";

type GithubRepoSelect = GithubRepo & { selected: boolean }

export const StepTwo = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { actions, state } = useStateMachine({ updateAction });
  const [userRepos, setUserRepos] = useState<GithubRepoSelect[]>([]);
  const onSubmit = (data) => {
    actions.updateAction(data);
  };

  // Fetch the user's repos from GitHub
  console.log(state)
  useEffect(() => {
    async function fetchData() {
      getUserRepos(state.username)
        .then(map(mergeLeft({ selected: false })))
        .then((data) => setUserRepos(data))
    }
    fetchData();

    return;
  }, [state.username])

  const visibleOptions = userRepos.filter(option => option.selected)
  const hiddenOptions = userRepos.filter(option => !option.selected)

  const toggle = name => {
    setUserRepos(
      userRepos.map(option => {
        if (option.name === name) option.selected = !option.selected
        return option
      }),
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ActionList selectionVariant="multiple">
        <ActionList.Group title="Selected Repositories">
          {visibleOptions.map(option => (
            <ActionList.Item key={option.name} selected={true} onSelect={() => toggle(option.name)}>
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
            <ActionList.Item key={option.name} selected={false} onSelect={() => toggle(option.name)}>
              {option.name}
            </ActionList.Item>
          ))}
          {hiddenOptions.length === 0 && <ActionList.Item disabled>No hidden fields</ActionList.Item>}
        </ActionList.Group>
      </ActionList>
    </form>
  )
}
