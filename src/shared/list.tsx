import { Box, Header, Avatar, PageLayout } from "@primer/react"
import React, { useCallback } from "react"
import { ReactSortable } from "react-sortablejs"
import { SortableGithubRepo } from "../global"
import { ListItem } from "./list-item"

// TODO - Disable sorting when we to the viewer side
export const List = ({SortableActionList, userRepos, setUserRepos, state }) => {
  const renderItem = useCallback(
    (repo: SortableGithubRepo) => {
      return (
        <ListItem key={repo.name} {...repo} />
      )
    },
    [],
  )

  return (<Box sx={{ height: 500, width: 318, overflowY: 'auto', border: '1px solid', borderColor: 'border.default' }}>
    <Box>
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
    </Box>
    <PageLayout padding='none'>
      <PageLayout.Content>
        <ReactSortable
          tag={SortableActionList}
          list={userRepos}
          setList={setUserRepos}
          animation={250}
        >
          {userRepos.map(renderItem)}
        </ReactSortable>
      </PageLayout.Content>
    </PageLayout>
  </Box>)
}
