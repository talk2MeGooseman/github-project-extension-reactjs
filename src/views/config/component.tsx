import React from 'react';
import { BaseStyles, ThemeProvider, Box, SplitPageLayout } from '@primer/react'
import { useForm } from "react-hook-form";
import { getUserRepos } from '../../services/github';
import { UsernameInput } from './form-components';

export const Config = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  watch((value, { name, type }) => {
    console.log(value, name, type)

    if (name === 'username' && value.username.length > 0) {
      // getUserRepos(value.username).then((response) => {
      //   console.log(response)
      // })
    }
  })

  return (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <SplitPageLayout>
            <SplitPageLayout.Header>
              <UsernameInput register={register} errors={errors} />
            </SplitPageLayout.Header>
            <SplitPageLayout.Pane>
              <Box sx={{ display: 'grid', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box key={i} as="p" sx={{ margin: 0 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at enim id lorem tempus egestas a non ipsum.
                    Maecenas imperdiet ante quam, at varius lorem molestie vel. Sed at eros consequat, varius tellus et, auctor
                    felis. Donec pulvinar lacinia urna nec commodo. Phasellus at imperdiet risus. Donec sit amet massa purus.
                  </Box>
                ))}
              </Box>
            </SplitPageLayout.Pane>
            <SplitPageLayout.Content>
              <input type="submit" />
            </SplitPageLayout.Content>
          </SplitPageLayout>
        </Box>
      </BaseStyles>
    </ThemeProvider>
  );
}
