import { ProgressData } from "../../mocks/progress";
import ProgressBlock from "./progress-block";

type ProgressProps = {
    onClickExit: () => void
}

function Progress({onClickExit}:ProgressProps) {
    return ( 
        <div className="progress-block">
            <div className="progress-header">
                <button onClick={onClickExit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </button>
                <p>Мой прогресс</p>
            </div>
            <div className="progress-content">
                {ProgressData.map(progress => <ProgressBlock key={progress.id} id={progress.id} name={progress.name} listBlock={progress.listBlock}/>)}
            </div>
        </div>
     );
}

export default Progress;