type ProfileButtonsProps = {
    onClickLinks: () => void;
    onClickGroupTable: () => void;
}

function ProfileButtons({onClickLinks, onClickGroupTable}: ProfileButtonsProps) {
    return (     
        <div>
            <button onClick={onClickLinks}>
                <img src="" alt="" width={57} height={52}></img>
                <p>Ссылки</p>
            </button>
            <button onClick={onClickGroupTable}>
                <img src="" alt="" width={57} height={52}></img>
                <p>Группа</p>
            </button>
            <button>
                <img src="" alt="" width={57} height={52}></img>
                <p>UDV COINS</p>
            </button>
            <button>
                <img src="" alt="" width={57} height={52}></img>
                <p>Выход</p>
            </button>
        </div>
     );
}

export default ProfileButtons;