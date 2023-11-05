type HeaderProps = {
    onClickProfile: () => void;
}

function Header({onClickProfile}: HeaderProps) {
    return ( 
        <header>
            <img src="" alt="udv group space exploration" width={257} height={46}></img>
            <div>
                <p>Первые дни</p>
            </div>
            <div>
                <p>Иван Иванов</p>
                <button onClick={onClickProfile}>
                    <img src="" alt="Профиль" width={42} height={42}></img>
                </button>
            </div>
        </header>
     );
}

export default Header;