import { Alert } from "@mui/joy";

interface MyAlertProps {
  type: "success" | "warning" | "danger" | "neutral" | "primary";
  header: string;
  text: string;
}

export const MyAlert = (props: MyAlertProps) => {
  return (
    <Alert
      variant="soft"
      color={props.type}
      className="animate-fade-in rounded-2xl drop-shadow-sm"
    >
      {props.header}
      <br />
      {props.text}
    </Alert>
  );
};
