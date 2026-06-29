interface Props {
  guessed: number;
  remaining: number;
}

const Score = ({ guessed, remaining }: Props) => (
  <div className="mx-2 mt-6 flex justify-between">
    <span>
      Remaining: <span className="font-semibold text-error">{remaining}</span>
    </span>
    <span>
      Guessed: <span className="font-semibold text-success">{guessed}</span>
    </span>
  </div>
);

export default Score;
