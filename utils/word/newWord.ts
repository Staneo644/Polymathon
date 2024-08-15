export interface NewWord {
    name: string;
    definition: string;
    type: string;
    etymology: string;
    example: string | null;
    theme: number | null;
};