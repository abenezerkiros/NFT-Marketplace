import { Button, CircularProgress } from "@material-ui/core";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export default function LoadMore({ disabled, loading, onClick }: Props) {
  return (
    <div>
      <Button onClick={onClick} variant="outlined" disabled={disabled} type="submit" style={{ marginBottom: "65px" }}>
        {loading ? <CircularProgress size={24} /> : "Load more"}
      </Button>
    </div>
  );
}
