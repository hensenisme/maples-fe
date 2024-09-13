// src/data/toolsData.ts
export type Component = {
    name: string;
    stock: number;
};

export type Tool = {
    id: number;
    name: string;
    components: Component[];
};

export const toolsData: Tool[] = [
    {
        id: 1,
        name: 'Habibi Grow',
        components: [
            { name: 'Sensor Suhu', stock: 5 },
            { name: 'Microcontroller', stock: 2 },
        ],
    },
    {
        id: 2,
        name: 'Habibi Climate',
        components: [
            { name: 'Kipas Pendingin', stock: 10 },
            { name: 'Panel Surya', stock: 3 },
        ],
    },
    {
        id: 3,
        name: 'Habibi Station',
        components: [
            { name: 'Sensor Hujan', stock: 8 },
            { name: 'Baterai 12V', stock: 1 },
        ],
    },
    {
        id: 4,
        name: 'Habibi RSC',
        components: [
            { name: 'Modul LoRa', stock: 4 },
            { name: 'Antena', stock: 6 },
        ],
    },
];
