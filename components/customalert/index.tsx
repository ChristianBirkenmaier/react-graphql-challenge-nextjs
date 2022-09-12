import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export function FetchErrorAlert() {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        An error occured while fetching your data, sorry :(
      </AlertDescription>
    </Alert>
  );
}
