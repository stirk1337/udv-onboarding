type AchievementProps ={
    id: string,
    icon: string,
    type: string,
    data: string,
    coins: number,
    completed: boolean,
}

function Achievement({id, icon, type, data, coins, completed}:AchievementProps) {
    return ( 
        <div className="achievement">
            <img src={icon} alt="" width={85} height={85}></img>
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