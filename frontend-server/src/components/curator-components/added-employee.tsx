type AddedEmployeesProps = {
    id: string
    avatar: string,
    data: string
}

function AddedEmployee({id, avatar, data}: AddedEmployeesProps) {
    return ( 
        <li className="added-list-item">
            <img src={avatar} alt="" width={31} height={31}></img>
            <p>{data}</p>
        </li>
     );
}

export default AddedEmployee;