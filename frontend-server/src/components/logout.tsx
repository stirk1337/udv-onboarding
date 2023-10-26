import axios from "axios";

function Logout({onLogin}: any) {
    function handleFormSubmit(evt: any){
        evt.preventDefault();
        axios.post('http://localhost/api/v1/auth/jwt/logout', {
          }, {withCredentials: true})
          .then(function (response) {
            console.log(response);
            onLogin()
          })
          .catch(function (error) {
            console.log(error);
          });
    }


    return ( 
        <>
            <form>
                <button type="submit" onClick={handleFormSubmit}>Вайпнуться</button>
            </form>
        </>
     );
}

export default Logout;