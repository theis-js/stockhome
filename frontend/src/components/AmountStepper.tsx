import { IconButton, Input } from "@mui/joy";
import { Minus, Plus } from "lucide-react";

interface AmountStepperProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
}

export const AmountStepper = ({
  value,
  onChange,
  onBlur,
  min = 0,
}: AmountStepperProps) => {
  const step = (delta: number) => onChange(Math.max(min, (value || 0) + delta));

  return (
    <div
      className="flex rounded-2xl border border-solid"
      style={{ borderColor: "var(--joy-palette-divider)" }}
    >
      <IconButton
        type="button"
        variant="plain"
        size="lg"
        disabled={value <= min}
        onClick={() => step(-1)}
        className="flex-none transition-transform active:scale-90"
        sx={{ borderRadius: 0 }}
      >
        <Minus size={16} />
      </IconButton>
      <Input
        type="number"
        value={value}
        className="grow"
        onChange={(e) => {
          const nextValue = Number(e.target.value);
          onChange(Number.isNaN(nextValue) ? min : Math.max(min, nextValue));
        }}
        onBlur={onBlur}
        variant="plain"
        size="lg"
        slotProps={{ input: { className: "text-center font-semibold" } }}
        sx={{
          borderRadius: 0,
          "--Input-focusedThickness": "0px",
          bgcolor: "var(--joy-palette-background-surface)",
        }}
      />
      <IconButton
        type="button"
        variant="plain"
        size="lg"
        onClick={() => step(1)}
        className="flex-none transition-transform active:scale-90"
        sx={{ borderRadius: 0 }}
      >
        <Plus size={16} />
      </IconButton>
    </div>
  );
};
