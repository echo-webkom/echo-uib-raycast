import { Detail } from "@raycast/api";

interface Props {
  message: string;
}

export const ErrorDetail = ({ message }: Props) => {
  const markdown = `
  # Error

  ${message}
  `;

  return <Detail markdown={markdown} />;
};
