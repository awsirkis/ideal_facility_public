export const state = () =>({
    user: null,
    password: null,
    isAuth: false,
    documents:[
        {name:"product 1",model:"12345",assetTag:"12345",department:'3'},
        {name:"product 2",model:"56789",assetTag:"12345", department:'2'},
        {name:"product 3",model:"34567",assetTag:"12345", department:'1'}
    ]
})

export const getters = {
    user: state=>{
        return state.user
    },
    name: state=>{
        return state.user ? state.user.name : null
    },
    email: state=>{
        return state.user ? state.user.email : null
    },
    isAuth: state=>{
        return state.isAuth
    },
    username: state=>{
        return state.user ? state.user.username : null
    },
    password: state=>{
        return state.user ? state.user.password : null
    },
    id: state=>{
        return state.user ? state.user.id : null
    },
    documents: state=>{
        return state.documents
    },
    role: state =>{
        return state.user ? state.user.role : null
    }
}

export const actions = {
    nuxtServerInit(){},
    async login({ commit },{user}) {
        commit('user',user)
    },
    async storePass({commit},{pass}){
        commit('pass',pass)
    },
    async logout({commit}){
        commit('user', null)
        commit('pass', null)
    },
    async docs({commit}, {docs}){
        console.log(docs)
        commit('docs', docs)
    },
    async addDepartment({params}){

    },
    async editDepartment({params}){
        
    },
    async deleteDepartment({params}){
        
    },
    async getDepartment({params}){
        
    },
    async addProduct({params}){
        
    },
    async editProduct({params}){
        
    },
    async deleteProduct({params}){
        
    },
    async getProduct({params}){
        
    },
    async addCategory({params}){
        
    },
    async editCategory({params}){
        
    },
    async deleteCategory({params}){
        
    },
    async getCategory({params}){
        
    },
    async addDocument({params}){
        
    },
    async editDocument({params}){
        
    },
    async deleteDocument({params}){
        
    },
    async getDocument({params}){
        
    },
}

export const mutations = {
    user(state, user){
        state.isAuth = user != null
        state.user = user
    },
    pass(state, pass){
        state.password = pass
    },
    docs(state,docs){
        state.documents = docs
        console.log(state.documents)
    }
}