import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "./store.tsx";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;