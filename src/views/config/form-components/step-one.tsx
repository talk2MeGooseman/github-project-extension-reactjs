import { FormControl, TextInput, Button } from "@primer/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";

type FormValues = {
  username: string;
};

export const StepOne = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { username: state.username }
  });
  const onSubmit = (data: FormValues) => {
    actions.updateAction(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl required>
        <FormControl.Label>
          Your GitHub Username
        </FormControl.Label>
        <TextInput
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
          Example "talk2megooseman"
        </FormControl.Caption>
      </FormControl>
      <Button type="submit" sx={{marginTop: '1rem'}} block>Set Username</Button>
    </form>
  )
}
