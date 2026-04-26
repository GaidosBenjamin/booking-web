import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface BookingSelection {
  buildingId: string;
  buildingName: string;
  holdId?: string;
  holdExpiresAt?: string;
}

interface BookingFlowState {
  selections: Record<string, BookingSelection>; // key: camperId
}

interface BookingFlowContextType {
  state: BookingFlowState;
  setSelection: (camperId: string, selection: BookingSelection) => void;
  removeSelection: (camperId: string) => void;
  clearSelections: () => void;
}

const BookingFlowContext = createContext<BookingFlowContextType | undefined>(undefined);

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingFlowState>({ selections: {} });

  const setSelection = useCallback((camperId: string, selection: BookingSelection) => {
    setState((prev) => ({
      selections: {
        ...prev.selections,
        [camperId]: selection,
      },
    }));
  }, []);

  const removeSelection = useCallback((camperId: string) => {
    setState((prev) => {
      const { [camperId]: _, ...rest } = prev.selections;
      return { selections: rest };
    });
  }, []);

  const clearSelections = useCallback(() => {
    setState({ selections: {} });
  }, []);

  return (
    <BookingFlowContext.Provider value={{ state, setSelection, removeSelection, clearSelections }}>
      {children}
    </BookingFlowContext.Provider>
  );
}

export function useBookingFlow(): BookingFlowContextType {
  const context = useContext(BookingFlowContext);
  if (!context) {
    throw new Error('useBookingFlow must be used within a BookingFlowProvider');
  }
  return context;
}
