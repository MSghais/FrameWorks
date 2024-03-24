
export type LFGState = {
    active: string;
    total_button_presses: number;
    step: number;
    selectedQuest: number;
    page?: string | "initial" | "result";
};

export const initialState = {
    active: "1",
    total_button_presses: 0,
    step: 0,
    selectedQuest: 0,
    page: "initial",
};