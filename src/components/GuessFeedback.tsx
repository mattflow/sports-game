import type { Outcome } from "../game/gameReducer";

interface Props {
  outcome: Outcome;
}

// Mirrors the states-game feedback line. A correct guess shows the official team
// name in green; it disappears once the input clears.
const GuessFeedback = ({ outcome }: Props) => {
  if (outcome.kind === "correct") {
    return <span className="text-success">{outcome.teamName}</span>;
  }
  if (outcome.kind === "drink") {
    return <span className="text-error">Drink</span>;
  }
  if (outcome.kind === "none") {
    return <span className="text-error">Not a team</span>;
  }
  if (outcome.kind === "ambiguous") {
    return <span className="text-warning">Which one?</span>;
  }
  return null;
};

export default GuessFeedback;
