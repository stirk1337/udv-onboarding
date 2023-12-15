import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate()
    
    return ( 
        <div style={{height: '90vh', paddingTop: '20%'}}>
            <h1 className="not-found">Page Not Found<br></br>Страница не найдена</h1>
            <button style={{width: 'fit-content', padding: '0 10px'}} type="submit" className="send-button" onClick={() => {navigate('/'); navigate(0)}}>Вернуться на главную</button>
        </div>
     );
}

export default NotFoundPage;