type AddedEmployeesProps = {
    id: number
    avatar: string,
    data: string
    onDelete: (id: number) => void
}

function AddedEmployee({id, avatar, data, onDelete}: AddedEmployeesProps) {
    return ( 
        <li className="added-list-item" onClick={() => onDelete(id)}>
            <img src={avatar} alt="" width={31} height={31}></img>
            <p>{data}</p>
        </li>
     );
}

export default AddedEmployee;