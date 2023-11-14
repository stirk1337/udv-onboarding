import ListBlock from "./list-block";
import ProgressBarComponent from "./progress-bar";
type ProgressBlockProps = {
    id: string,
    name: string,
    listBlock: ListBlock[],
}

type ListBlock = {
    id: string,
    name: string,
    completed: boolean,
}


function ProgressBlock({id, name, listBlock}: ProgressBlockProps) {
    return ( 
        <div className="progress-data">
            <div className="progress-data-header">
                <p>{name}</p>
                <div className="progress-progress-bar">
                    <ProgressBarComponent/>
                </div>
            </div>
            <div className="progress-list">
                <ul>
                    {listBlock.map(block => <ListBlock key={block.id} id={block.id} name={block.name} completed={block.completed}/>)}
                </ul>
            </div>
        </div>
     );
}

export default ProgressBlock;