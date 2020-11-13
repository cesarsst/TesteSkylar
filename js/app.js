new Vue({
    el: '#app',
    template: `
    <div class="container-fluid">
            
        <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="index.html">
                <img src="img/banner.png" width="50" height="50" alt="">    
                Skylar Note
            </a>
        </nav>

        <div class="container mt-5">
            <div class="row justify-content-center">

                <div class="col-sm">
                </div>

                <div class="col-sm">                    
                    <div class="input-group mb-3">
                        <input v-model="inputSearch" type="text" class="form-control" placeholder="Nome da pessoa" aria-label="Recipient's username" aria-describedby="button-addon2">
                        <div class="input-group-append">
                            <button v-on:click="clearInputSearch"class="btn btn-outline-secondary" type="button" id="button-addon2">Limpar</button>
                        </div>
                    </div>        
                </div>

                <div class="col-sm">
                    <button v-on:click="resetError, updateModal('Novo usuário', -1)" type="button" class="btn btn-primary" data-toggle="modal" data-target="#newUser">
                        Novo usuário
                    </button>                    
                </div>
            </div>
            <div class="row mt-5 d-flex justify-content-center">
                <button v-on:click="filterUser" type="button" class="btn btn-primary btn-sm">
                    Ordenar por nome
                </button>
            </div>

            <div class="row d-flex justify-content-center">

                <div class="card mr-3 mt-3" style="width: 18rem;" v-for="(user, index) in users" v-if="user.visible">
                    <div class="card-body">
                        <h5 class="card-title">{{user.name}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">E-mail: {{user.email}}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Telefone: {{user.phone}}</h6>
                        <a v-on:click="updateModal('Alterar Usuário', index)" href="#" data-toggle="modal" data-target="#newUser" class="card-link">Alterar</a>
                        <a v-on:click.prevent="removeUser(index)" href="#" class="card-link">Excluir</a>
                    </div>
                </div> 

            </div>

        </div>
        
        <div  class="modal fade" id="newUser" tabindex="-1" aria-labelledby="newUser" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{modalTitle}}</h5>                        
                    </div>

                    <div class="modal-body">

                        <div id="error">
                            <p style="color:red;">Os campos não podem ser nulos!</p>
                        </div>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3">Nome:</span>
                            </div>
                            <input v-model="name" name="name" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                        </div>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3">E-mail:</span>
                            </div>
                            <input v-model="email" name="email" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                        </div>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3">Telefone:</span>
                            </div>
                            <input v-model="phone" name="phone" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button v-on:click= "clearInputs" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button v-on:click="addUser" v-if="salvarButton" type="button" class="btn btn-primary" >Salvar</button>
                        <button v-on:click="updateUser"  v-if="updateButton" type="button" class="btn btn-primary">Alterar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `,
    data(){
        return {
            users: [],
            userFind: [],
            // Get users and populate users list
            request: axios.get('https://jsonplaceholder.typicode.com/users', {})
            .then(response =>{
                response.data.forEach(element => {
                    this.users.push({
                        name: element.name,
                        email: element.email,
                        phone: element.phone,
                        visible: true
                    })
                });
            }).catch(error =>{
                console.log(error);
            }),
            name:'',
            email:'',
            phone:'',
            inputSearch:'',
            modalTitle:'',
            salvarButton:'',
            updateButton:'',
            updateIndex:'',
        }
    },
    watch:{
        inputSearch: function(){
            this.findUser();
        }
    },
    methods:{
        // Add new user
        addUser(){
            if(this.name.trim() == '' || this.email.trim()=='' || this.phone.trim() == ''){
                $("#error").show(); // Show error div
            } else {
                this.users.push({
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    visible: true
                });

                this.clearInputs();

                // Hide Modal
                $('#newUser').modal('hide');
            }
        },
        // Remove user by index
        removeUser(index){
            this.users.splice(index, 1);
        },
        // Clear all inputs
        clearInputs(){
            
            this.name = '';
            this.email = '';
            this.phone = '';
            this.updateIndex = '';
            this.resetError();
        },
        // Sort users by name
        filterUser(){
            this.users.sort((a, b)=>{
                return (a.name > b.name) ? 1: ((b.name > a.name) ? -1:0);
            })
        },
        // Hide div error
        resetError(){
            $("#error").hide();
        },
        // Find and show user search
        findUser(){
            if(this.inputSearch.trim()  != '' || this.inputSearch == ''){
                this.users.forEach(user =>{
                    if(user.name.toLowerCase().indexOf(this.inputSearch.toLowerCase()) != -1){
                        user.visible = true;
                    }else{
                        user.visible = false;
                    }
                })
               
            }else{
                this.user.forEach(user=>{
                    user.visible = true;
                })
            }
            
        },
        // Update modal to save or update user 
        updateModal(title, indice){
            this.modalTitle = title;
            if(indice != -1){
                this.updateButton = true;
                this.salvarButton = false;
                let user = this.users[indice];
                this.name = user.name;
                this.email = user.email;
                this.phone = user.phone;
                this.updateIndex = indice;
            }else{
                this.updateButton = false;
                this.salvarButton = true;
            }
        },
        // Update a exist user
        updateUser(){
            if(this.name.trim() == '' || this.email.trim()=='' || this.phone.trim() == ''){
                $("#error").show();
            } else {
                // Add to user list
                let userUpdate = this.users[this.updateIndex];
                userUpdate.name = this.name;
                userUpdate.email = this.email;
                userUpdate.phone = this.phone; 

                this.clearInputs();

                // Hide Modal
                $('#newUser').modal('hide');
            }
           
        },
        clearInputSearch(){
            this.inputSearch = '';
            this.users.forEach(user=>{
                user.visible = true;
            })
        }

    }
})

$(document).ready(function(){
    $("#error").hide();
});