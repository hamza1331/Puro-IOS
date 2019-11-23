/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
 import React, {Component} from 'react';
 import { Platform, Text, View,ScrollView,ToastAndroid,ActivityIndicator,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard} from 'react-native';
 import {Header,Icon,CheckBox} from 'react-native-elements';
 import {TextField} from 'react-native-material-textfield'
 import {Dropdown} from 'react-native-material-dropdown'
 import { SafeAreaView } from "react-navigation";
import { url } from "./Proxy";
import { connect } from "react-redux";
 class ShippingForm extends Component {
   constructor(props){
     super(props)
     this. state = {
       domCost:'0',
       domDelivery:{
         from:'0',
         to:'0'
       },
       domesticService:"",
       intCost:'0',
       intDelivery:{
         from:'0',
         to:'0'
       },
       internationalService:"",
       domAdditional:'0',
       intAddtional:'0',
       loading:false,
       type:'both',
       showDomestic:false,
       showInternational:false,
       showBoth:true,
       title:'',
       description:'',
       showDomOther:false,
       otherDomService:'',
       showIntService:false,
       otherIntSevice:''
     }
     this.handleSubmit=this.handleSubmit.bind(this)
     this.showDomesticForm=this.showDomesticForm.bind(this)
     this.showInternationalForm=this.showInternationalForm.bind(this)
     this.showBothForm=this.showBothForm.bind(this)
     this.handleCreate=this.handleCreate.bind(this)
   }
   showDomesticForm() {
    this.setState({
        showDomestic: true,
        showInternational: false,
        type: "domestic",
        showBoth:false
    })
}
   showInternationalForm() {
    this.setState({
        showDomestic: false,
        showInternational: true,
        type: "international",
        showBoth:false
    })
}
   showBothForm() {
    this.setState({
        showDomestic: false,
        showInternational: false,
        type: "both",
        showBoth:true
    })
}
   componentDidMount(){
    if(this.props.shippingProfile!==null){
        if(this.props.shippingProfile.type==='both'){
            let data = this.props.shippingProfile
            let shippingProfile = {
                           domCost:data.domCost.toString(),
                           domDelivery:{
                             from:data.domDelivery.from.toString(),
                             to:data.domDelivery.to.toString()
                           },
                           domesticService:data.domesticService,
                           intCost:data.intCost.toString(),
                           intDelivery:{
                             from:data.intDelivery.from.toString(),
                             to:data.intDelivery.to.toString()
                           },
                           internationalService:data.internationalService,
                           domAdditional:data.domAdditional?data.domAdditional.toString():'',
                           intAddtional:data.intAddtional?data.intAddtional.toString():'',
                         }
                         this.setState({...shippingProfile,title:data.title,description:data.description})
                         this.showBothForm()
                }
         else if(this.props.shippingProfile.type==='domestic'){
            let data = this.props.shippingProfile
            let shippingProfile = {
                           domCost:data.domCost.toString(),
                           domDelivery:{
                             from:data.domDelivery.from.toString(),
                             to:data.domDelivery.to.toString()
                           },
                           domesticService:data.domesticService,
                           type:"domestic",
                           showDomestic:true
                         }
                         this.setState({...shippingProfile,title:data.title,description:data.description})
                         this.showDomesticForm()
                }
        else if(this.props.shippingProfile.type==='international'){
            let data = this.props.shippingProfile
            let shippingProfile = {
                           intCost:data.intCost.toString(),
                           intDelivery:{
                             from:data.intDelivery.from.toString(),
                             to:data.intDelivery.to.toString()
                           },
                           internationalService:data.internationalService,
                           domAdditional:data.domAdditional?data.domAdditional.toString():'',
                           intAddtional:data.intAddtional?data.intAddtional.toString():'',
                           type:'international',
                           showInternational:true
                         }
                         this.setState({...shippingProfile,title:data.title,description:data.description})
                         this.showInternationalForm()
                }
    }
   }
   handleSubmit(){
     this.setState({
       domesticService:this.state.otherDomService
     })
    if(this.props.shippingProfile===null){
        this.handleCreate()
    }
    else{
        if(this.state.showDomestic){
            let data = this.state
    this.setState({
      loading:true
    })
    let shippingProfile = {
      domCost:parseInt(data.domCost),
      domDelivery:{
        from:parseInt(data.domDelivery.from),
        to:parseInt(data.domDelivery.to)
      },
      domesticService:data.domesticService,
      domAdditional:parseInt(data.domAdditional),
      firebaseUID:this.props.UID,
      title:this.state.title,
      type:this.state.type,
      description:this.state.description
    }
    fetch(url+'/api/updateShipping'+this.props.shippingProfile._id,{method:"PUT",body:JSON.stringify(shippingProfile),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
      if(response.message==='Success'){
        this.setState({
          ...data,
          loading:false
        })
        if(Platform.OS==='android'){
          ToastAndroid.showWithGravityAndOffset(
            'Shipping Profile Updated!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      }
      else if(response.message==='Failed'){
        this.setState({
            loading:false
        })
        if(Platform.OS==='android'){
            ToastAndroid.showWithGravityAndOffset(
              'Update Error!!',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
      }
    }).catch(err=>console.log(err))
        }
        else if (this.state.showInternational){
            let data = this.state
    this.setState({
      loading:true
    })
    let shippingProfile = {
      intCost:parseInt(data.intCost),
      intDelivery:{
        from:parseInt(data.intDelivery.from),
        to:parseInt(data.intDelivery.to)
      },
      internationalService:data.internationalService,
      intAddtional:parseInt(data.intAddtional),
      firebaseUID:this.props.UID,
      title:this.state.title,
      type:this.state.type,
      description:this.state.description
    }
    fetch(url+'/api/updateShipping'+this.props.shippingProfile._id,{method:"PUT",body:JSON.stringify(shippingProfile),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
      if(response.message==='Success'){
        this.setState({
          ...data,
          loading:false
        })
        if(Platform.OS==='android'){
          ToastAndroid.showWithGravityAndOffset(
            'Shipping Profile Updated!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      }
      else if(response.message==='Failed'){
        this.setState({
            loading:false
        })
        if(Platform.OS==='android'){
            ToastAndroid.showWithGravityAndOffset(
              'Update Error!!',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
      }
    }).catch(err=>console.log(err))
        }
        else if(this.state.showBoth){
    let data = this.state
    this.setState({
      loading:true
    })
    let shippingProfile = {
      domCost:parseInt(data.domCost),
      domDelivery:{
        from:parseInt(data.domDelivery.from),
        to:parseInt(data.domDelivery.to)
      },
      domesticService:data.domesticService,
      intCost:parseInt(data.intCost),
      intDelivery:{
        from:parseInt(data.intDelivery.from),
        to:parseInt(data.intDelivery.to)
      },
      internationalService:data.internationalService,
      domAdditional:parseInt(data.domAdditional),
      intAddtional:parseInt(data.intAddtional),
      firebaseUID:this.props.UID,
      title:this.state.title,
      type:this.state.type,
      description:this.state.description
    }
    fetch(url+'/api/updateShipping'+this.props.shippingProfile._id,{method:"PUT",body:JSON.stringify(shippingProfile),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
      if(response.message==='Success'){
        this.setState({
          ...data,
          loading:false
        })
        if(Platform.OS==='android'){
          ToastAndroid.showWithGravityAndOffset(
            'Shipping Profile Updated!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      }
      else if(response.message==='Failed'){
        this.setState({
            loading:false
        })
        if(Platform.OS==='android'){
            ToastAndroid.showWithGravityAndOffset(
              'Update Error!!',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
      }
    }).catch(err=>console.log(err))
        }
    }
   }
   handleCreate(){
    let data = this.state
    this.setState({
      loading:true
    })
    let shippingProfile = {
      domCost:parseInt(data.domCost),
      domDelivery:{
        from:parseInt(data.domDelivery.from),
        to:parseInt(data.domDelivery.to)
      },
      domesticService:data.domesticService,
      intCost:parseInt(data.intCost),
      intDelivery:{
        from:parseInt(data.intDelivery.from),
        to:parseInt(data.intDelivery.to)
      },
      internationalService:data.internationalService,
      domAdditional:parseInt(data.domAdditional),
      intAddtional:parseInt(data.intAddtional),
      firebaseUID:this.props.UID,
      title:this.state.title,
      type:this.state.type,
      description:this.state.description
    }
    fetch(url+'/api/addShipping',{method:"PUT",body:JSON.stringify(shippingProfile),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
      if(response.message==='Success'){
        this.setState({
          ...data,
          loading:false
        })
        if(Platform.OS==='android'){
          ToastAndroid.showWithGravityAndOffset(
            'Shipping Profile Updated!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      }
    }).catch(err=>console.log(err))
   }
   render() {
     const Company=[{
       value:'TCS'
     }
     ,{
       value:'Fedex'
     }
     ,{
       value:'TNTExpress'
     }
     ,{
       value:'DHL'
     },
     {
       value:'Otro'
     }
   ]
     return (
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'none'}  style={{ flex: 1 }}>

   <SafeAreaView style={{flex:1}}>
      <Header placement="left"
       leftComponent={
         <Icon  containerStyle={{marginBottom:8}}
         name="ios-arrow-round-back"
         type="ionicon"
         color="darkred"
         size={40}
         onPress={()=>this.props.navigation.goBack()}
         
         />
        }
        centerComponent={{ text: 'Perfil de envío', style: { color: 'darkred',fontSize:20,marginBottom:10} }}
        containerStyle={{backgroundColor:'#F3F3F2', borderTopLeftRadius:15,
        borderTopRightRadius:15
      }}
      />
        <ScrollView>

    <View style={{marginTop:25,marginLeft:15}}>
               <Text style={{color:'darkred',fontSize:30}}>{this.state.title!==''?this.state.title:'Crear perfil de envío'}</Text>
             </View>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row' }} contentContainerStyle={{justifyContent:'space-evenly'}}>
                        <CheckBox
                            title='Nacional'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.showDomestic}
                            onPress={this.showDomesticForm}
                            checkedColor='darkred'
                            containerStyle={{ marginLeft: 5, backgroundColor: 'white', borderWidth: 0,flexBasis:'30%' }}
                            />
                        <CheckBox
                            center
                            title='Internacional'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.showInternational}
                            onPress={this.showInternationalForm}
                            containerStyle={{ marginLeft: 5, backgroundColor: 'white', borderWidth: 0,flexBasis:"30%" }}
                            checkedColor='darkred'
                            />
                        <CheckBox
                            center
                            title='Ambos'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.showBoth}
                            onPress={this.showBothForm}
                            containerStyle={{ marginLeft: 5, backgroundColor: 'white', borderWidth: 0,flexBasis:'30%' }}
                            checkedColor='darkred'
                            />
                    </ScrollView>

        <KeyboardAvoidingView>
        <TextField
        label='Título'
         value={this.state.title}
         onChangeText={(title) => this.setState({title }) }
         tintColor="darkred"
         maxLength={30}
         containerStyle={{marginLeft:15,marginRight:15}}
         />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextField
         label='Descripción'
         value={this.state.description}
         onChangeText={(description) => this.setState({description }) }
         tintColor="darkred"
         maxLength={100}
         containerStyle={{marginLeft:15,marginRight:15}}
         />
        </KeyboardAvoidingView>
            {this.state.showBoth && <View>
                <View style={{borderBottomColor:'gray',borderBottomWidth:1,paddingBottom:10}}>
             <View style={{marginTop:15,marginLeft:15}}>
               <Text style={{color:'darkred',fontSize:22}}>Nacional</Text>
             </View>
 <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
         label='Empresa'
         value={this.state.domesticService}
         data={Company}
         onChangeText={text=>{
           if(text==='Otro'){
             {this.setState({domesticService:text,showDomOther:true})}
            }
            else{
              {this.setState({domesticService:text,showDomOther:false})}
              
            }
          }}
          />
      {this.state.showDomOther===true && <KeyboardAvoidingView>
      <TextField
         label='Servicios domésticos'
         value={this.state.otherDomService}
         onChangeText={(other) => this.setState({otherDomService:other }) }
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>}
      <KeyboardAvoidingView>
      <TextField
         label='El costo'
         suffix="$"
         value={this.state.domCost}
         onChangeText={(price) => this.setState({domCost:price }) }
         tintColor="darkred"
         keyboardType='numeric'
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
      <TextField
       suffix="$"
       label='Costo de entrega rápida'
       keyboardType='numeric'
       onChangeText={ (price) => this.setState({domAdditional:price}) }
       tintColor="darkred"
       value={this.state.domAdditional}
       containerStyle={{marginLeft:15,marginRight:15}}
       />
      </KeyboardAvoidingView>
       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
       <View style={{flexBasis:'45%'}}>
       <KeyboardAvoidingView>
       <TextField
         label='El tiempo de entrega'
         keyboardType='numeric'
         tintColor="darkred"
         value={this.state.domDelivery.from}
         onChangeText={text=>{
           let {domDelivery} = this.state
           domDelivery.from = text
           this.setState({domDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </KeyboardAvoidingView>
       </View>
       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
       <Text style={{fontSize:20,fontWeight:'bold'}}>a</Text>
       </View>
       <View style={{flexBasis:'45%'}}>
      <KeyboardAvoidingView>
      <TextField
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         keyboardType='numeric'
         label='Tiempo maximo'
         value={this.state.domDelivery.to}
         onChangeText={text=>{
           let {domDelivery} = this.state
           domDelivery.to = text
           this.setState({domDelivery})
           
          }}
          />
      </KeyboardAvoidingView>
       </View>
       </View>
       </View>
       <View>
             <View style={{marginTop:15,marginLeft:15}}>
               <Text style={{color:'darkred',fontSize:22}}>Internacional</Text>
             </View>
 <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
         label='Empresa'
         value={this.state.internationalService}
         data={Company}
         onChangeText={text=>{
           if(text==='Other'){
             {this.setState({internationalService:text,showIntService:true})}
            }
            else{
              {this.setState({internationalService:text,showIntService:false})}
              
            }
          }}
          />
       {this.state.showIntService===true && <KeyboardAvoidingView>
      <TextField
         label='International Services'
         value={this.state.otherIntSevice}
         onChangeText={(other) => this.setState({otherIntSevice:other }) }
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>}
      <KeyboardAvoidingView>

 <TextField
         label='Costo'
         value={this.state.intCost}
         onChangeText={(price) => this.setState({intCost:price }) }
         keyboardType='numeric'
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>
       <KeyboardAvoidingView>
       <TextField
         label='Costo de entrega rápida'
         value={this.state.intAddtional}
         onChangeText={ (price) => this.setState({intAddtional:price}) }
         keyboardType='numeric'
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
       </KeyboardAvoidingView>
       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
       <View style={{flexBasis:'45%'}}>
       <KeyboardAvoidingView>
       <TextField
         label='El tiempo de entrega'        
         keyboardType='numeric'
         tintColor="darkred"
         value={this.state.intDelivery.from}
         onChangeText={text=>{
           let {intDelivery} = this.state
           intDelivery.from = text
           this.setState({intDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </KeyboardAvoidingView>
       </View>
       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
       <Text style={{fontSize:20,fontWeight:'bold'}}>a</Text>
       </View>
       <View style={{flexBasis:'45%'}}>
       <KeyboardAvoidingView>
       <TextField
         keyboardType='numeric'
         label='Tiempo maximo'
         tintColor="darkred"
         value={this.state.intDelivery.to}
         onChangeText={text=>{
           let {intDelivery} = this.state
           intDelivery.to = text
           this.setState({intDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </KeyboardAvoidingView>
       </View>
       </View>
       </View>
            </View>}
            {this.state.showDomestic && <View style={{borderBottomColor:'gray',borderBottomWidth:1,paddingBottom:10}}>
             <View style={{marginTop:15,marginLeft:15}}>
               <Text style={{color:'darkred',fontSize:22}}>Domestic</Text>
             </View>
             <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
         label='Empresa'
         value={this.state.domesticService}
         data={Company}
         onChangeText={text=>{
           if(text==='Otro'){
             {this.setState({domesticService:text,showDomOther:true})}
            }
            else{
              {this.setState({domesticService:text,showDomOther:false})}
              
            }
          }}
          />
      {this.state.showDomOther===true && <KeyboardAvoidingView>
      <TextField
         label='Servicios domésticos'
         value={this.state.otherDomService}
         onChangeText={(other) => this.setState({otherDomService:other }) }
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>}
      <KeyboardAvoidingView>
      <TextField
         label='El costo'
         suffix="$"
         value={this.state.domCost}
         onChangeText={(price) => this.setState({domCost:price }) }
         tintColor="darkred"
         keyboardType='numeric'
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>
        <KeyboardAvoidingView>
        <TextField
       suffix="$"
       label='Costo de entrega rápida'
       keyboardType='numeric'
       onChangeText={ (price) => this.setState({domAdditional:price}) }
       tintColor="darkred"
       value={this.state.domAdditional}
       containerStyle={{marginLeft:15,marginRight:15}}
       />
        </KeyboardAvoidingView>
       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
       <View style={{flexBasis:'45%'}}>
       <KeyboardAvoidingView>
       <TextField
         label='El tiempo de entrega'
         keyboardType='numeric'
         tintColor="darkred"
         value={this.state.domDelivery.from}
         onChangeText={text=>{
           let {domDelivery} = this.state
           domDelivery.from = text
           this.setState({domDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </KeyboardAvoidingView>
       </View>
       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
       <Text style={{fontSize:20,fontWeight:'bold'}}>to</Text>
       </View>
       <View style={{flexBasis:'45%'}}>
       <KeyboardAvoidingView>
       <TextField
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         keyboardType='numeric'
         label='Tiempo maximo'
         value={this.state.domDelivery.to}
         onChangeText={text=>{
           let {domDelivery} = this.state
           domDelivery.to = text
           this.setState({domDelivery})
          }}
          />
       </KeyboardAvoidingView>
       </View>
       </View>
       </View>
        }
        {this.state.showInternational && <View style={{borderBottomColor:'gray',borderBottomWidth:1,paddingBottom:10}}>

               <Text style={{color:'darkred',fontSize:22}}>International</Text>
               <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
         label='Empresa'
         value={this.state.internationalService}
         data={Company}
         onChangeText={text=>{
           if(text==='Otro'){
             {this.setState({internationalService:text,showIntService:true})}
            }
            else{
              {this.setState({internationalService:text,showIntService:false})}
              
            }
          }}
          />
       {this.state.showIntService===true && <KeyboardAvoidingView>
      <TextField
         label='Servicios internacionales'
         value={this.state.otherIntSevice}
         onChangeText={(other) => this.setState({otherIntSevice:other }) }
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>}
      <KeyboardAvoidingView>

 <TextField
         label='Costo'
         value={this.state.intCost}
         onChangeText={(price) => this.setState({intCost:price }) }
         keyboardType='numeric'
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
      </KeyboardAvoidingView>
       <KeyboardAvoidingView>
       <TextField
         label='Costo de entrega rápida'
         value={this.state.intAddtional}
         onChangeText={ (price) => this.setState({intAddtional:price}) }
         keyboardType='numeric'
         tintColor="darkred"
         containerStyle={{marginLeft:15,marginRight:15}}
         />
       </KeyboardAvoidingView>
       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
      <KeyboardAvoidingView>
       <View style={{flexBasis:'45%'}}>
         <TextField
         label='El tiempo de entrega'        
         keyboardType='numeric'
         tintColor="darkred"
         value={this.state.intDelivery.from}
         onChangeText={text=>{
           let {intDelivery} = this.state
           intDelivery.from = text
           this.setState({intDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </View>
      </KeyboardAvoidingView>
       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
       <Text style={{fontSize:20,fontWeight:'bold'}}>to</Text>
       </View>
       <KeyboardAvoidingView>

       <View style={{flexBasis:'45%'}}>
       <TextField
         keyboardType='numeric'
         label='Tiempo maximo'
         tintColor="darkred"
         value={this.state.intDelivery.to}
         onChangeText={text=>{
           let {intDelivery} = this.state
           intDelivery.to = text
           this.setState({intDelivery})
           
          }}
          containerStyle={{marginLeft:15,marginRight:15}}
          />
       </View>
        </KeyboardAvoidingView>
       </View>

        </View>}

         </ScrollView>    
         <View onTouchEnd={this.handleSubmit} style={{backgroundColor:'darkred',position: 'relative', left: 0, right: 0, bottom: 0,height:40,width:'100%',alignItems:'center',justifyContent:'center'}}>
        {this.state.loading===false && <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Salvar</Text>}
        {this.state.loading && <ActivityIndicator size={Platform.OS==='android'?18:0} color='white' animating/>}
          </View>
   </SafeAreaView>
 </KeyboardAvoidingView>
   
     )
   }
 }
 function mapStateToProps(state){
   return({
     UID:state.rootReducer.UID,
     shippingProfile:state.rootReducer.shippingProfile
   })
 }
 function mapActionsToProps(dispatch){
   return({
   
   })
 }
 export default connect(mapStateToProps,mapActionsToProps)(ShippingForm)