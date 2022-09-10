import {
  Button,
  ButtonGroup,
  Select,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { NUMBER_OF_ITEMS_TO_FETCH } from "@config/constants";
import { useEffect, useState } from "react";

export function PaginationFooter({
  pageInfo,
  setPagination,
  totalCount,
  loading,
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
  console.log(totalCount);

  if (totalCount <= NUMBER_OF_ITEMS_TO_FETCH) return null;

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
