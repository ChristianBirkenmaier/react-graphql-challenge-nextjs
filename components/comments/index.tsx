import { ListItem, OrderedList, Text } from "@chakra-ui/react";

export function Comment({
  body,
  loginName,
}: {
  body: string;
  loginName?: string;
}) {
  return (
    <ListItem my="1rem" borderWidth="1px" borderRadius="5px" p="0.5rem">
      <Text>{body}</Text>
      <Text fontSize="sm">By {loginName}</Text>
    </ListItem>
  );
}

export function CommentsList({ nodes }: { nodes: any }) {
  return (
    <OrderedList id="comment-list" overflow="auto">
      {nodes?.map((node: any) => {
        if (!node) return null;

        return (
          <Comment
            key={node.id}
            loginName={node.author?.login}
            body={node.body}
          />
        );
      })}
    </OrderedList>
  );
}
