import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import { baseApi } from "@/services/api/baseApi";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  store = createTestStore(),
  initialRoute = "/"
) => {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
};

describe("Global Search & TopNav Search Integration", () => {
  it("renders search trigger in TopNav with correct placeholder and shortcut", () => {
    renderWithProviders(<TopNav />);

    expect(
      screen.getByText(/Search workforce, employees, candidates.../i)
    ).toBeInTheDocument();
  });

  it("opens GlobalSearchDialog when search trigger button is clicked in TopNav", async () => {
    renderWithProviders(<TopNav />);

    const searchBtn = screen.getByText(/Search workforce, employees, candidates.../i);
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          /Search workforce, employees, candidates, pages, actions.../i
        )
      ).toBeInTheDocument();
    });
  });

  it("renders GlobalSearchDialog with quick navigation and action items", () => {
    const handleOpenChange = vi.fn();
    renderWithProviders(
      <GlobalSearchDialog open={true} onOpenChange={handleOpenChange} />
    );

    // Default items
    expect(screen.getByText("Add New Employee")).toBeInTheDocument();
    expect(screen.getByText("Apply for Leave")).toBeInTheDocument();
    expect(screen.getByText("Process Payroll")).toBeInTheDocument();
  });

  it("filters search results when typing in search input", async () => {
    const handleOpenChange = vi.fn();
    renderWithProviders(
      <GlobalSearchDialog open={true} onOpenChange={handleOpenChange} />
    );

    const input = screen.getByPlaceholderText(
      /Search workforce, employees, candidates, pages, actions.../i
    );

    fireEvent.change(input, { target: { value: "payroll" } });

    await waitFor(() => {
      expect(screen.getByText("Payroll & Compensation")).toBeInTheDocument();
      expect(screen.getByText("Process Payroll")).toBeInTheDocument();
    });
  });
});
