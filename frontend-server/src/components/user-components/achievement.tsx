type AchievementProps ={
    type: string,
    data: string,
    coins: number,
    completed: boolean,
}

function Achievement({type, data, coins, completed}:AchievementProps) {
    return ( 
        <div className="achievement">
            <img src={completed ? '/achievement-icon.svg' : '/not-completed-achievement-icon.svg'} alt="" width={85} height={85}></img>
            <div className="achievement-data">
                <p className="type">{type}</p>
                <p>{data}</p>
                <p>{coins} udv coins</p>
            </div>
            {completed && <img className="completed-icon" src="/completed-icon.svg" alt=""></img>}
        </div>
     );
}

export default Achievement;