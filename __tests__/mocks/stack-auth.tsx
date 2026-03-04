import { StackProvider } from "@stackframe/stack";
import { ReactNode } from "react";

// Mock Stack Client App
const mockStackClientApp = {
  useUser: () => ({
    id: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
  }),
  useSignOut: () => async () => {},
};

export function StackAuthProvider({ children }: { children: ReactNode }) {
  return (
    <StackProvider app={mockStackClientApp as never}>{children}</StackProvider>
  );
}

export function mockStackUser(overrides?: Record<string, unknown>) {
  return {
    id: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    ...overrides,
  };
}
