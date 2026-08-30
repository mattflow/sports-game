import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import type { ChangeEventHandler, RefObject } from "react";
import type { Outcome } from "../game/gameReducer";
import GuessFeedback from "./GuessFeedback";

interface Props {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  outcome: Outcome;
  inputRef: RefObject<HTMLInputElement | null>;
}

const getIcon = (outcome: Outcome) => {
  if (outcome.kind === "drink" || outcome.kind === "none") {
    return <ExclamationCircleIcon strokeWidth={2} className="h-5 w-5 text-error" aria-hidden="true" />;
  }
  if (outcome.kind === "correct") {
    return <CheckCircleIcon strokeWidth={2} className="h-5 w-5 text-success" aria-hidden="true" />;
  }
  return null;
};

const GuessInput = ({ value, onChange, outcome, inputRef }: Props) => (
  <div className="form-control mt-4 w-full">
    <div className="relative rounded-md shadow-sm">
      <input
        ref={inputRef}
        type="text"
        autoFocus
        autoComplete="off"
        placeholder="Guess here..."
        className="input-bordered input block w-full"
        value={value}
        onChange={onChange}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
        {getIcon(outcome)}
      </div>
    </div>
    <div className="ml-2 mt-2 font-semibold">
      <GuessFeedback outcome={outcome} />
    </div>
  </div>
);

export default GuessInput;
