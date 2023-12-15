type UsefulLinksProps ={
    onClickExit: () => void
    isOpen: boolean
}

function UsefulLinks({onClickExit, isOpen}: UsefulLinksProps) {
    return ( 
        <div className="useful-links-block" style={{
            opacity: !isOpen ? "0" : "1",
            transition: "all .5s",
            visibility: !isOpen ? "hidden" : "visible",
          }}>
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
                        <a href="https://confluence.ussc.ru/display/HR/Onboarding"><div className="links-image"><img src="/link-icon.png" alt="" width={63} height={63}></img></div>Confluence</a>
                    </li>
                    <li>
                        <a href="https://udv.dev/"><img src="/career-site.png" alt="" width={63} height={63}></img>Карьерный сайт</a>
                    </li>
                    <li>
                        <a href="https://udv.group/"><img src="/commercial-site.png" alt="" width={63} height={63}></img>Коммерческий сайт</a>
                    </li>
                    <li>
                        <a href="https://welcomeudv.tilda.ws/"><img src="/welcome-page.png" alt="" width={63} height={63}></img>Welcome-page</a>
                    </li>
                </ul>
            </div>
        </div>
     );
}

export default UsefulLinks;