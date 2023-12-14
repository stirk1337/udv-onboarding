import ListBlock from "./list-block";
import ProgressBarComponent from "./progress-bar";
type ProgressBlockProps = {
    name: string,
    icon: string
    listBlock: ListBlock[],
}

type ListBlock = {
    id: number,
    name: string,
    completed: boolean,
}


function ProgressBlock({name, icon, listBlock}: ProgressBlockProps) {
    const completedTaskNumber = listBlock.filter((block) => block.completed === true).length;
    return ( 
        <div className="progress-data">
            <div className="progress-data-header">
                <div className="progress-header-data">
                    <img width={50} height={50} src={`/planet-prev/${icon}.png`} alt=""></img>
                    <p>{name}</p>
                </div>
                <div className="progress-progress-bar">
                    <ProgressBarComponent percentage={completedTaskNumber / listBlock.length * 100}/>
                </div>
            </div>
            <div className="progress-list">
                <ul>
                    {listBlock.map(block => <ListBlock key={block.id} name={block.name} completed={block.completed}/>)}
                </ul>
            </div>
        </div>
     );
}

export default ProgressBlock;