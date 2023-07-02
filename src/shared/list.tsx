import { Box, Header, Avatar, PageLayout } from "@primer/react"
import React, { useCallback } from "react"
import { ReactSortable } from "react-sortablejs"
import { SortableGithubRepo } from "../global"
import { ListItem } from "./list-item"

export const List = ({ SortableActionList, userRepos, setUserRepos, state, disableSorting }) => {
  // TODO: Fetch the users information so that we can get a link to their profile photo

  const renderItem = useCallback(
    (repo: SortableGithubRepo) => {
      return (
        <ListItem sortingDisabled={disableSorting} key={repo.name} {...repo} />
      )
    },
    [disableSorting],
  )

  return (
    <Box sx={{ height: 500, width: 318, overflowY: 'auto', border: '1px solid', borderColor: 'border.default' }}>
      <Header sx={{
        position: 'sticky',
        top: 0,
        height: 64,
        zIndex: 1,
      }}>
        <Header.Item>
          <Header.Link href="#" sx={{ fontSize: 2 }}>
            <Avatar src="https://avatars.githubusercontent.com/primer" sx={{ mr: 2 }} />
            <span>{state.username}</span>
          </Header.Link>
        </Header.Item>
      </Header>
      <PageLayout padding='none'>
        <PageLayout.Content>
          <ReactSortable
            tag={SortableActionList}
            list={userRepos}
            setList={setUserRepos}
            animation={250}
            disabled={disableSorting}
          >
            {userRepos.map(renderItem)}
          </ReactSortable>
        </PageLayout.Content>
      </PageLayout>
    </Box>)
}
