type UsefulLinksProps ={
    onClickExit: () => void
}

function UsefulLinks({onClickExit}: UsefulLinksProps) {
    return ( 
        <div className="useful-links-block">
            <div className="useful-links-header">
                <button onClick={onClickExit}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
                            <path d="M29 2L2 29M2.00006 2L29 29" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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