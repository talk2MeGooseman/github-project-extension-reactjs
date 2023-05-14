import { FormControl, TextInput } from "@primer/react";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type UsernameInputProps = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

export const UsernameInput = ({ register, errors }: UsernameInputProps) => (
  <FormControl>
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
    />
    <FormControl.Caption>
      Enter your username, for example "talk2megooseman"
    </FormControl.Caption>
  </FormControl>)
