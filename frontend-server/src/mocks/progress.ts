type ProgressData = {
    id: string,
    name: string,
    listBlock: ListBlock[],
}

type ListBlock = {
    id: string,
    name: string,
    completed: boolean,
}

export const ProgressData: ProgressData[] = [
    {
        id: '1',
        name: 'Первые дни',
        listBlock: [
            {
                id: '1',
                name: 'Подпись документов',
                completed: true,
            },
            {
                id: '2',
                name: 'Коллеги',
                completed: false,
            },
            {
                id: '3',
                name: 'Охрана труда',
                completed: false,
            },
            {
                id: '4',
                name: 'Welcome Pack',
                completed: true,
            },
            {
                id: '5',
                name: 'Верстка',
                completed: false,
            },
            {
                id: '6',
                name: 'Обратная связь',
                completed: false,
            },
        ],
    },
    {
        id: '2',
        name: 'Тестирование',
        listBlock: [
            {
                id: '1',
                name: 'Test case',
                completed: false,
            },
            {
                id: '2',
                name: 'TDD',
                completed: true,
            },
            {
                id: '3',
                name: 'List case',
                completed: false,
            },
            {
                id: '4',
                name: 'Test Driver',
                completed: true,
            },
            {
                id: '5',
                name: 'Git test',
                completed: false,
            },
            {
                id: '6',
                name: 'Лучшие библиотеки для тестирования',
                completed: true,
            },
        ],
    },
    {
        id: '3',
        name: 'Первые дни',
        listBlock: [
            {
                id: '1',
                name: 'Подпись документов',
                completed: true,
            },
            {
                id: '2',
                name: 'Коллеги',
                completed: false,
            },
            {
                id: '3',
                name: 'Охрана труда',
                completed: false,
            },
            {
                id: '4',
                name: 'Welcome Pack',
                completed: true,
            },
            {
                id: '5',
                name: 'Верстка',
                completed: false,
            },
            {
                id: '6',
                name: 'Обратная связь',
                completed: false,
            },
        ],
    },
    {
        id: '4',
        name: 'Тестирование',
        listBlock: [
            {
                id: '1',
                name: 'Test case',
                completed: false,
            },
            {
                id: '2',
                name: 'TDD',
                completed: true,
            },
            {
                id: '3',
                name: 'List case',
                completed: false,
            },
            {
                id: '4',
                name: 'Test Driver',
                completed: true,
            },
            {
                id: '5',
                name: 'Git test',
                completed: false,
            },
            {
                id: '6',
                name: 'Лучшие библиотеки для тестирования',
                completed: true,
            },
        ],
    },
]
