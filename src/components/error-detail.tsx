import { Detail } from "@raycast/api";

interface Props {
  message: string;
}

const ErrorDetail = ({ message }: Props) => {
  const markdown = `
  # Error

  ${message}
  `;

  return <Detail markdown={markdown} />;
};

export default ErrorDetail;
