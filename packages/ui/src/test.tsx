interface TestProps {
  prop1: string;
  prop2: number;
}

export function Test({ prop1, prop2 }: TestProps) {
  return (
    <div className="animate-bounce">{`This is a test: ${prop1} ${prop2}`}</div>
  );
}
