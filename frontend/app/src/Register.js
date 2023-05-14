import React from 'react'
//import "./Register.css"

class Register extends React.Component{
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
        <h1 class="h3 mb-3 fw-normal" >Inscrivez-vous</h1>

        <div class="form-group">
          <input type="text" class="form-control" id="nom_user" aria-describedby="nomHelp" placeholder="Nom"/>
        </div>

        <div class="form-group">
          <input type="text" class="form-control" id="prenom_user" aria-describedby="prenomHelp" placeholder="Prénom"/>
        </div>

        <div class="form-group">
          <input type="text" class="form-control" id="identifiant_user" aria-describedby="idHelp" placeholder="Identifiant"/>
        </div>
    


        <div class="form-group">
          <input type="email" class="form-control" id="email_user" aria-describedby="emailHelp" placeholder="Adresse mail"/>
        </div>

        <div class="form-group">
          <input type="password" class="form-control" id="password_user" placeholder="Mot de passe"/>
        </div>

        <div class="form-group">
        <div class="input-group">
          <input name="confirmPassword" type="password" autocomplete="off" class="form-control" id="confirmPassword" placeholder="Confirmez Mot de passe" aria-describedby="inputGroupPrepend" required/>
          <div class="invalid-feedback">
            Mot de passe différent
          </div>
        </div>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">S'inscrire</button>


        <a href="">Déjà inscrit ? Connectez-vous !</a>
      </form>
      </div>
    );
  }
}
export default Register;

