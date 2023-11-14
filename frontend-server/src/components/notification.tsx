type NotificationProps = {
    id: string,
    avatar: string,
    sender: string,
    data: string,
    date: string,
    checked:boolean
}

function Notification({id, avatar, sender, data, date, checked}: NotificationProps) {
    return ( 
        <div className="notification-item">
            <img src={avatar} alt="аватар" width={33} height={33}></img>
            <div className="notification-data">
                <p><b>{sender}</b>{data}</p>
                <div className="notification-date">
                    <p>{date}</p>
                </div>
                {!checked && <div className="not-checked"></div>}
            </div>
        </div>
    );
}

export default Notification;