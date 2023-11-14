type UsefulLinksProps ={
    onClickExit: () => void
}

function UsefulLinks({onClickExit}: UsefulLinksProps) {
    return ( 
        <div className="useful-links-block">
            <div className="useful-links-header">
                <button onClick={onClickExit}>
                    <img src="/close-dialog-icon.svg" alt="закрыть окно" width={67} height={40}></img>
                </button>
                <p>Полезные ссылки</p>
            </div>
            <div className="useful-links-content">
                <ul>
                    <li>
                        <img src="/link-icon.svg" alt="" width={63} height={63}></img><a href="">Confluence</a>
                    </li>
                    <li>
                        <img src="/link-icon.svg" alt="" width={63} height={63}></img><a href="">Карьерерный сайт</a>
                    </li>
                    <li>
                        <img src="/link-icon.svg" alt="" width={63} height={63}></img><a href="">Коммерческий сайт</a>
                    </li>
                    <li>
                        <img src="/link-icon.svg" alt="" width={63} height={63}></img><a href="">Welcome-page</a>
                    </li>
                </ul>
            </div>
        </div>
     );
}

export default UsefulLinks;