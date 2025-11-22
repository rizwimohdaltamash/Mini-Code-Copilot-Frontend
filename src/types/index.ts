export interface Generation {
    id: number;
    prompt: string;
    code: string;
    createdAt: string;
    starred: boolean;
    language: {
        id: number;
        name: string;
    };
}

