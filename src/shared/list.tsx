import { Box, Header, Avatar, PageLayout, ActionList } from "@primer/react"
import React, { useCallback, forwardRef, Dispatch, SetStateAction, useEffect } from "react"
import { ReactSortable } from "react-sortablejs"
import { SortableRepo } from "../global"
import { ListItem } from "./list-item"
import { GlobalState } from "little-state-machine"
import { isEmpty } from "ramda"
import { UseFormSetValue } from "react-hook-form"
import { Step3FormValues } from "../views/config/form-components"

const SortableActionList = forwardRef<any, any>((props, ref) => {
  return <ActionList showDividers ref={ref}>{props.children}</ActionList>;
});

type ListProps = {
  setValue?: UseFormSetValue<Step3FormValues>;
  repos: GlobalState['repos'];
  username: GlobalState['username'];
  disableSorting: true;
} | {
  setValue: UseFormSetValue<Step3FormValues>;
  repos: GlobalState['repos'];
  username: GlobalState['username'];
  disableSorting: false;
}

type ListItemFields = {
  id: string;
  owner: string;
  name: string;
  chosen: boolean;
  nameWithOwner: string;
}

export const List = ({ setValue = () => {}, repos, username, disableSorting }: ListProps) => {
  const [userRepos, setUserRepos] = React.useState<ListItemFields[]>([]);

  const updateListState = useCallback((list: ListItemFields[]) => {
    setUserRepos(list);
    const repos = list.map((repo) => repo.nameWithOwner);
    setValue('repos', repos);
  }, [setValue])

  useEffect(() => {
    const listItems = repos.map((repo: string) => {
      const [owner, name] = repo.split('/')
      return ({ id: repo, owner, name, chosen: false, nameWithOwner: repo })
    })
    updateListState(listItems)
  }, [updateListState, username, repos])

  const renderItem = useCallback(
    (repo: SortableRepo) => (
      <ListItem sortingDisabled={disableSorting} key={repo.id} name={repo.name} owner={repo.owner} chosen={repo.chosen} />
    ), [disableSorting])

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
            <span>{username}</span>
          </Header.Link>
        </Header.Item>
      </Header>
      <PageLayout padding='none'>
        <PageLayout.Content>
          <ReactSortable
            tag={SortableActionList}
            list={userRepos}
            setList={updateListState}
            animation={250}
            disabled={disableSorting}
          >
            {userRepos.map(renderItem)}
          </ReactSortable>
        </PageLayout.Content>
      </PageLayout>
    </Box>)
}
