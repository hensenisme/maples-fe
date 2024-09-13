// src/models/types.ts
export interface Component {
    id: string;
    name: string;
    stock: number;
}

export interface Tool {
    id: string;
    name: string;
    components: Component[];
}
