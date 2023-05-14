import React from 'react'
//import "./Register.css"

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Le nom a été soumis : ' + this.state.value);
    event.preventDefault();
  }

 

  render(){
    return(

      <div class="form-signin w-50 m-auto">
      <form>
        <h1 class="h3 mb-3 fw-normal" >Connectez-vous</h1>

        <div class="form-group">
          <input type="text" class="form-control" id="identifiant_user" aria-describedby="idHelp" placeholder="Identifiant"/>
          <a href="">Identifiant oublié ?</a>
        </div>

        <div class="form-group">
          <input type="password" class="form-control" id="password_user" placeholder="Mot de passe"/>
          <a href="">Mot de passe oublié ?</a>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Se connectez</button>


        <a href="">Pas encore inscrit ? Inscrivez-vous !</a>
      </form>
      </div>
    );
  }
}
export default Login;

