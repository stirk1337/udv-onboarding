import ProgressBarComponent from "./progress-bar";
import Achievement from "./achievement";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAchievements } from "../store/api-actions/get-actions";

type AchievementsProps ={
    onClickExit: () => void
}

function Achievements({onClickExit}:AchievementsProps) {
    const dispatch = useAppDispatch()
    const achievements = useAppSelector((state) => state.achievements)
    const completedAchievementsNumber = achievements.filter(achievement => achievement.completed === true).length;

    console.log(achievements)

    useEffect(() => {
        dispatch(getAchievements())
    }, [])

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
                <ProgressBarComponent percentage={completedAchievementsNumber / achievements.length * 100}/>
            </div>
            <div className="achievements-content">
                {achievements.map(achievement => <Achievement key={achievement.name} type={achievement.name} data={achievement.description} coins={10} completed={achievement.completed}/>)}
            </div>
        </div>
     );
}

export default Achievements;