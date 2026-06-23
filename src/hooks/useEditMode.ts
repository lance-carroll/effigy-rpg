import { useState } from "react";

// Edit mode is a pure permission gate: it does not change layout, it
// only determines whether dot tracks accept clicks to invest a new dot.
export function useEditMode(initial = false) {
  const [editMode, setEditMode] = useState(initial);
  return { editMode, setEditMode, toggleEditMode: () => setEditMode((v) => !v) };
}
