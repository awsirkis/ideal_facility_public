<template>
<div class="programimage col-xs-12 col-md-6 col-lg-12">
    <div class="largemedia">
        <div class="program media">
            
            <div class="media-body ml-4">
                
                <h3 class="program-title">{{TITLE}}</h3>
                
                <p class="program-descrip">{{DESCRIPTION}}</p>
            </div>
            <img alt="image" :src="`${src}`" align="left" style="width: 25%; height: auto;" class="align-self-center mb-3 mt-3 mr-4 ml-4">
            
        </div>
    </div>
    <div class="smallmedia">
        <div class="card">
            <img alt="image" :src="`${src}`" class="card-img-top"/>
            <div class="card-body">
                <h3 class="card-title">{{TITLE}}</h3>
                <p class="card-text" v-if="DESCRIPTION != ''">{{DESCRIPTION}}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {Skeleton} from 'vue-loading-skeleton'
export default {
    
    components:{
        Skeleton
    },
    name: 'programleftimage',
    props:{
        SRC:{
            type: Array,
            default:['osmkkf_logo.png']
        },
        TITLE:{
            type: String
        },
        DESCRIPTION:{
            type: String
        }
    },
    computed:{
        src: function(){
            try {
                var m = require('~/assets/img/' + this.SRC[Math.floor(Math.random()*this.SRC.length)]);
			} catch (ex) {
				var m = require('~/assets/img/osmkkf_logo.png');
			}
			return m.toString();
        }
    }
    
}
</script>

<style>
.program{
    width: 95%; 
    margin: 2.5%; 
    background-color: grey;
}
.program-title{
    border-bottom: 3px solid lightgrey; 
    padding: 2.5%;
}

.program-descrip{
    width: 100%; 
    min-height: 250px;
}
.smallmedia .card{
    color: white;
    background-color: grey;
}
.smallmedia .card .card-title{
    border-bottom: 3px solid white;
}
.smallmedia .card:hover{
    color: white;
    background-color: grey;
    
    cursor: default;
}
.smallmedia{
    padding-top: 2rem;
}
@media screen and (min-width: 992px){
    .largemedia{
        display: block;
    }
    .smallmedia{
        display:none;
    }
}
@media screen and (max-width: 992px){
    .largemedia{
        display: none;
    }
    .smallmedia{
        display:block;
    }
}
</style>