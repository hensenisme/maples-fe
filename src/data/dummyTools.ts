// src/data/dummyTools.ts
import { v4 as uuidv4 } from 'uuid';
import { Tool } from '../models/types';

export const tools: Tool[] = [
    {
        id: uuidv4(),
        name: "Habibi Grow",
        components: [
            { id: uuidv4(), name: "Sensor Suhu", stock: 10 },
            { id: uuidv4(), name: "Sensor Kelembaban", stock: 5 },
        ],
    },
    {
        id: uuidv4(),
        name: "Habibi Climate",
        components: [
            { id: uuidv4(), name: "Fan", stock: 7 },
            { id: uuidv4(), name: "Pompa Air", stock: 2 },
        ],
    },
    {
        id: uuidv4(),
        name: "Habibi Station",
        components: [
            { id: uuidv4(), name: "GPS Module", stock: 12 },
            { id: uuidv4(), name: "Antena", stock: 4 },
        ],
    },
    {
        id: uuidv4(),
        name: "Habibi RSC",
        components: [
            { id: uuidv4(), name: "Relay", stock: 8 },
            { id: uuidv4(), name: "Controller", stock: 3 },
        ],
    },
];
