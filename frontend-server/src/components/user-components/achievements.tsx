import ProgressBarComponent from "./progress-bar";
import { AchievementData } from "../../mocks/achievement";
import Achievement from "./achievement";

type AchievementsProps ={
    onClickExit: () => void
}

function Achievements({onClickExit}:AchievementsProps) {
    return ( 
        <div className="achievements-block">
            <div className="achievements-header">
                <button onClick={onClickExit}>
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                </button>
                <p>Мои достижения</p>
            </div>
            <div className="achievements-progress-bar">
                <ProgressBarComponent/>
            </div>
            <div className="achievements-content">
                {AchievementData.map(achievement => <Achievement key={achievement.id} id={achievement.id} icon={achievement.icon} type={achievement.type} data={achievement.data} coins={achievement.coins} completed={achievement.completed}/>)}
            </div>
        </div>
     );
}

export default Achievements;