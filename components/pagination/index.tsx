import { Button, ButtonGroup } from "@chakra-ui/react";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";

export function PaginationFooter({
  pageInfo,
  setPagination,
  totalCount,
  loading,
}: {
  pageInfo:
    | {
        __typename?: "PageInfo" | undefined;
        endCursor?: string | null | undefined;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string | null | undefined;
      }
    | undefined;
  setPagination: any;
  totalCount: number | undefined;
  loading: boolean;
}) {
  const fetchFirstPage = () => {
    setPagination({
      first: undefined,
      last: NUMBER_OF_ITEMS_TO_FETCH,
    });
  };
  const fetchLastPage = () => {
    setPagination({
      first: NUMBER_OF_ITEMS_TO_FETCH,
      last: undefined,
    });
  };
  const fetchBefore = () => {
    setPagination({
      first: undefined,
      last: NUMBER_OF_ITEMS_TO_FETCH,
      after: undefined,
      before: pageInfo?.startCursor,
    });
  };
  const fetchAfter = () => {
    setPagination({
      first: NUMBER_OF_ITEMS_TO_FETCH,
      last: undefined,
      after: pageInfo?.endCursor,
      before: undefined,
    });
  };

  if (!totalCount || totalCount <= NUMBER_OF_ITEMS_TO_FETCH) return null;

  return (
    <ButtonGroup my="1rem" variant="outline" isAttached>
      <Button disabled={!pageInfo?.hasNextPage} onClick={fetchAfter}>
        Previous Page
      </Button>
      <Button onClick={fetchFirstPage}>1</Button>
      <Button disabled>...</Button>
      <Button onClick={fetchLastPage} isLoading={loading}>
        {totalCount && Math.ceil(totalCount / NUMBER_OF_ITEMS_TO_FETCH)}
      </Button>
      <Button disabled={!pageInfo?.hasPreviousPage} onClick={fetchBefore}>
        Next Page
      </Button>
    </ButtonGroup>
  );
}
