import { ActionList, Avatar, Box, Header, PageLayout } from "@primer/react"
import { GlobalState } from "little-state-machine"
import React, { forwardRef, useCallback, useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"
import { ReactSortable } from "react-sortablejs"
import { useQuery } from "urql"
import { SortableRepo } from "../global"
import { Step3FormValues } from "../views/config/form-components"
import { GithubUserInfo } from "./graphql"
import { ListItem } from "./list-item"

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

export const List = ({ setValue, repos, username, disableSorting }: ListProps) => {
  const [userRepos, setUserRepos] = React.useState<ListItemFields[]>([]);

  const [{ data, fetching }] = useQuery({
    query: GithubUserInfo,
    variables: { username },
  })

  const updateListState = useCallback((list: ListItemFields[]) => {
    setUserRepos(list);
    const repos = list.map((repo) => repo.nameWithOwner);
    if (setValue !== undefined) {
      setValue('repos', repos);
    }
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
      <ListItem sortingDisabled={disableSorting} key={repo.id} {...repo} />
    ), [disableSorting])

  return (
    <Box sx={{ height: 500, width: 318, overflowY: 'auto', border: '1px solid', borderColor: 'border.default' }}>
      <Header sx={{
        position: 'sticky',
        top: 0,
        height: 64,
        zIndex: 1,
      }}>
        {fetching ? <span>Loading...</span> : (<Header.Item>
          <Header.Link href={data?.github?.user.url} sx={{ fontSize: 2 }} target="_blank" rel="noopener noreferrer">
            <Avatar src={data?.github?.user.avatarUrl} size={40} sx={{ mr: 2 }} />
            <span>{data?.github?.user.login}</span>
          </Header.Link>
        </Header.Item>)}
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
