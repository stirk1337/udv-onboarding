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
            <svg className="delete-user" xmlns="http://www.w3.org/2000/svg" width="33" height="37" viewBox="0 0 33 37" fill="none">
                <path d="M12.1942 18.6667V28.1389M19.9443 18.6667V28.1389M1 9.19446H32M4.44531 15.2222V30.2525C4.44531 33.3655 7.04767 35.8889 10.2578 35.8889H21.8828C25.0931 35.8889 27.6953 33.3655 27.6953 30.2525V15.2222M10.4718 5.31946C10.4718 3.17935 12.1424 1.44446 14.2032 1.44446H17.9347C19.9956 1.44446 21.6662 3.17935 21.6662 5.31946V9.19446H10.4718V5.31946Z" stroke="#ED4242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </li>
     );
}

export default AddedEmployee;