import { FormControl, TextInput, Button } from "@primer/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import { updateAction } from "../../../state/update-action";

type FormValues = {
  username: string;
};

export const StepThree = () => {
  const { actions, state } = useStateMachine({ updateAction });
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { username: state.username }
  });
  const onSubmit = (data: FormValues) => {
    actions.updateAction(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      Preview & Confirm
      <Button type="submit">Next</Button>
    </form>
  )
}
