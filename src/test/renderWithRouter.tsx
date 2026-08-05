import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import type { ReactElement, ReactNode } from "react";

type RenderWithRouterOptions = Omit<RenderOptions, "wrapper"> & {
  initialEntries?: string[];
};

export function renderWithRouter(
  component: ReactElement,
  { initialEntries = ["/"], ...renderOptions }: RenderWithRouterOptions = {},
) {
  function RouterWrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  }

  return {
    user: userEvent.setup(),
    ...render(component, {
      wrapper: RouterWrapper,
      ...renderOptions,
    }),
  };
}
