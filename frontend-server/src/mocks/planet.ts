type BlockData = {
    id: string,
    tasks: TasksData[]
}

type TasksData = {
    id: string,
    difficulty: number,
    name: string,
    data: string,
    completed: boolean
}

export const BlockData: BlockData[] = [
    {
        id: '1',
        tasks: [
            {
                id: '1',
                difficulty: 1,
                name: 'Прочитать текст',
                data: '<div><p>Цель: Прочитать этот текст</p><strong>И этот текст</strong><em>А теперь вот этот</em><h2>Большой текст</h2></div>',
                completed: true,
            },
            {
                id: '2',
                difficulty: 2,
                name: 'Перейти по ссылочке',
                data: '<div><a href="https://www.youtube.com/">Нажми на меня</a></div>',
                completed: true,
            },
            {
                id: '3',
                difficulty: 3,
                name: 'Посмотри на картиночки и посмотри видео',
                data: '<div><img src="https://img.freepik.com/free-photo/front-view-smiley-woman-with-fireworks_52683-98180.jpg?w=1380&t=st=1698688910~exp=1698689510~hmac=d6114cc52bf22e0a8213c72bbdc1d2498fd62011e6ba871f088de8ec742ef254" width="500"/><iframe allow="fullscreen;" width="420" height="315" src="https://www.youtube.com/embed/w1Jf6qbpD5w?si=t59vqLLWPGp2jeKrh"></iframe></div>',
                completed: false,
            },
        ]
    },
    {
        id: '2',
        tasks: [
            {
                id: '1',
                difficulty: 3,
                name: 'уву',
                data: '<div><p>Цель: Прочитать этот текст</p><strong>И этот текст</strong><em>А теперь вот этот</em><h2>Большой текст</h2></div>',
                completed: true,
            },
            {
                id: '2',
                difficulty: 2,
                name: 'Перейти по ссылочке',
                data: '<div><a href="https://www.youtube.com/">Нажми на меня</a></div>',
                completed: false,
            },
            {
                id: '3',
                difficulty: 1,
                name: 'Посмотри на картиночки и посмотри видео',
                data: '<div><img src="https://img.freepik.com/free-photo/front-view-smiley-woman-with-fireworks_52683-98180.jpg?w=1380&t=st=1698688910~exp=1698689510~hmac=d6114cc52bf22e0a8213c72bbdc1d2498fd62011e6ba871f088de8ec742ef254" width="500"/><iframe width="420" height="315" src="https://www.youtube.com/embed/w1Jf6qbpD5w?si=t59vqLLWPGp2jeKrh"></iframe></div>',
                completed: false,
            },
        ]
    },
    {
        id: '3',
        tasks: [
            {
                id: '1',
                difficulty: 1,
                name: 'xd',
                data: '<div><p>Цель: Прочитать этот текст</p><strong>И этот текст</strong><em>А теперь вот этот</em><h2>Большой текст</h2></div>',
                completed: false,
            },
            {
                id: '2',
                difficulty: 2,
                name: 'Перейти по ссылочке',
                data: '<div><a href="https://www.youtube.com/">Нажми на меня</a></div>',
                completed: false,
            },
            {
                id: '3',
                difficulty: 3,
                name: 'Посмотри на картиночки и посмотри видео',
                data: '<div><img src="https://www.google.com/search?q=%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8&sca_esv=577869291&tbm=isch&sxsrf=AM9HkKl88HJdaxlEuWP0hmO1h7bGNBD-lg:1698686561662&source=lnms&sa=X&ved=2ahUKEwixwd7IpJ6CAxX9JRAIHZe_Dg4Q_AUoAXoECAQQAw&biw=1920&bih=963&dpr=1#imgrc=-CLE2KT8cirrLM" /><video autoplay src={https://www.youtube.com/watch?v=w1Jf6qbpD5w&t=1s&ab_channel=Algosith}></video></div>',
                completed: false,
            },
        ]
    },
    {
        id: '4',
        tasks: [
            {
                id: '1',
                difficulty: 1,
                name: 'zxzc',
                data: '<div><p>Цель: Прочитать этот текст</p><strong>И этот текст</strong><em>А теперь вот этот</em><h2>Большой текст</h2></div>',
                completed: true,
            },
            {
                id: '2',
                difficulty: 2,
                name: 'Перейти по ссылочке',
                data: '<div><a href="https://www.youtube.com/">Нажми на меня</a></div>',
                completed: true,
            },
            {
                id: '3',
                difficulty: 3,
                name: 'Посмотри на картиночки и посмотри видео',
                data: '<div><img src="https://www.google.com/search?q=%D0%BA%D0%BE%D1%82%D0%B8%D0%BA%D0%B8&sca_esv=577869291&tbm=isch&sxsrf=AM9HkKl88HJdaxlEuWP0hmO1h7bGNBD-lg:1698686561662&source=lnms&sa=X&ved=2ahUKEwixwd7IpJ6CAxX9JRAIHZe_Dg4Q_AUoAXoECAQQAw&biw=1920&bih=963&dpr=1#imgrc=-CLE2KT8cirrLM" /><video autoplay src={https://www.youtube.com/watch?v=w1Jf6qbpD5w&t=1s&ab_channel=Algosith}></video></div>',
                completed: true,
            },
        ]
    },
    
]
