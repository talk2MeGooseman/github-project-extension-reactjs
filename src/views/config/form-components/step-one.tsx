import { FormControl, TextInput, Button } from "@primer/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";

export const StepOne = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { actions, state } = useStateMachine({ updateAction });
  const onSubmit = (data) => {
    actions.updateAction(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl required>
        <FormControl.Label>
          Your GitHub Username
        </FormControl.Label>
        <TextInput
          captionChildren="Enter your username, for example &quot;talk2megooseman&quot;"
          labelChildren="Your GitHub Username"
          loaderPosition="auto"
          size="medium"
          type="text"
          validationStatus={
            errors.username ? "error" : "success"
          }
          {...register("username", { required: true })}
          defaultValue={state.username}
        />
        <FormControl.Caption>
          Enter your username, for example "talk2megooseman"
        </FormControl.Caption>
      </FormControl>
      <Button type="submit">Next</Button>
    </form>
  )
}
