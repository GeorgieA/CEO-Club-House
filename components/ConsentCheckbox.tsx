import Link from "next/link";

interface ConsentCheckboxProps {
  id?: string;
  name?: string;
}

export default function ConsentCheckbox({
  id = "acceptTerms",
  name = "acceptTerms",
}: ConsentCheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 text-sm text-muted">
      <input
        id={id}
        name={name}
        type="checkbox"
        required
        value="on"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
      />
      <span>
        Ich akzeptiere die{" "}
        <Link
          href="/agb"
          target="_blank"
          className="font-semibold text-accent hover:underline"
        >
          AGB
        </Link>{" "}
        und die{" "}
        <Link
          href="/datenschutz"
          target="_blank"
          className="font-semibold text-accent hover:underline"
        >
          Datenschutzerklärung
        </Link>
        .
      </span>
    </label>
  );
}
