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
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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