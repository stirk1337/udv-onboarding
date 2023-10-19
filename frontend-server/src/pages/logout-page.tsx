import axios from "axios";

function LogoutPage({changeRegistered}: any) {
    function handleFormSubmit(evt: any){
        evt.preventDefault();
        axios.post('http://localhost/api/v1/auth/jwt/logout', {
          })
          .then(function (response) {
            console.log(response);
            changeRegistered()
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

export default LogoutPage;