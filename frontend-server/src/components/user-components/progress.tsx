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
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
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