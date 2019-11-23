/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {Component} from 'react';
import {Text, View,ScrollView,TouchableOpacity,KeyboardAvoidingView,AsyncStorage,ActivityIndicator,ToastAndroid,Platform,Alert} from 'react-native';
import {Icon} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown'
import {SafeAreaView} from 'react-navigation'
import {TextField} from 'react-native-material-textfield'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { countries } from "./countries";
import { setUserInfoAction } from "../store/actions/actions";
import { url } from "./Proxy";
import Modal from 'react-native-modal'
import Firebase from 'react-native-firebase'
 class UpdateProfile extends Component{
     constructor(props){
         super(props)
        this.initialState ={    
            title:'',
            description:'',
            option:'Suggestion',
            uploading:false,
            userData:null,
            countryData :[],
            country:'United States',
            updated:false,
            fName:'',
            lName:'',
            showModal:false,
            password:'',
            newPassowrd:'',
            confirmPassword:''
            }
         this.state={
             ...this.initialState
         }
         this.handleSubmit=this.handleSubmit.bind(this)
         this.handlePasswordReset=this.handlePasswordReset.bind(this)
     }
     async handlePasswordReset(){
       if(this.state.password.length>=6){
        if(this.state.newPassowrd===this.state.confirmPassword){
          this.setState({
            uploading:true
          })
          let data = {
            password:this.state.newPassowrd,
            firebaseUID:this.props.firebaseUID
          }
          fetch(url+'/api/updatePassword',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
          .then(res=>res.json())
          .then(response=>{
            if(response.message==='Success'){
              this.setState({uploading:false,showModal:false})
        Alert.alert('Éxito',"Contraseña actualizada exitosamente")                
              if(Platform.OS==='android'){
                ToastAndroid.showWithGravityAndOffset(
                  'Upload Complete!!',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              }
            }
            else if(response.message==='Failed'){
        Alert.alert('Ha fallado',"Actualización de contraseña fallida")
        this.setState({uploading:false})

            }
          })
         
        }
        else{
          this.setState({uploading:false})

          Alert.alert('Ha fallado',"Las contraseñas no coinciden")
        }
       }
       else{
        this.setState({uploading:false})
         Alert.alert('Ha fallado',"La contraseña debe contener 6 caracteres como mínimo")
       }
     }
     componentDidMount(){
        AsyncStorage.getItem('userData').then(response=>{
          if(response!==null){        
            if(this.props.userInfo!==null){
              let user = this.props.userInfo
              let names = user.fName.split(' ')
              console.log(user)
               if(names.length===1){
                this.setState({
                  userData:user,
                  fName:user.fName,
                  country:user.country
                 })
               }
               else if(names.length===2){
                this.setState({
                  userData:user,
                  fName:names[0],
                  lName:names[1],
                  country:user.country
                 })
               }
               else if(names.length===3){
                this.setState({
                  userData:user,
                  fName:names[0],
                  lName:names[1]+names[2],
                  country:user.country
                 })
               }
            }
           }
           })
           let countryData = countries.map(country=>{
            return{
                value:country.name
            }
        })
        this.setState({countryData})
     }
     handleSubmit(){
         if(this.state.updated){
          this.setState({
            uploading:true
        })
        let data =  {fName,lName,country} = this.state
        data.firebaseUID = this.props.UID
        data.fName = this.state.fName + " "+ this.state.lName
        console.log(data.fName)
        fetch(url+'/api/updateUser',{method:"PUT",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
        .then(res=>res.json()).then((response)=>{
          AsyncStorage.setItem('userData',JSON.stringify(response.doc))
          if(Platform.OS==='android'){
            ToastAndroid.showWithGravityAndOffset(
              'Profile Updated!!',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }
          this.props.setUserInfo(response.doc)
          this.setState({
            loading:false
          })
          this.props.navigation.goBack()
        }).catch(err=>Alert.alert('Failed',err))
         }
     }
     render() {
      
       return (
        <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',borderBottomColor:'gray',borderBottomWidth:2,paddingBottom:5}}>
        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}><Text style={{fontSize:30,marginLeft:10,marginTop:10}}>X</Text></TouchableOpacity>
        <Text style={{fontSize:20,marginLeft:20,marginTop:20,fontWeight:'bold'}}>Actualización del perfil</Text>
        <Icon
        name='ios-arrow-dropdown'
        type='ionicon'
        color='white'
        size={15}
        containerStyle={{marginTop:28,marginLeft:10}}
         />
        </View>
        <ScrollView>
        
        <View style={{marginTop:40}}>
    <KeyboardAvoidingView>
  <TextField
        label='Primer nombre'
        value={this.state.fName}
        onChangeText={ (fName) => this.setState({ fName,updated:true }) }
        tintColor="darkred"
        containerStyle={{marginLeft:15,marginRight:15}}
      />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
        <TextField
        label='Apellido'
        value={this.state.lName}
        onChangeText={ (lName) => this.setState({ lName,updated:true }) }
        tintColor="darkred"
        containerStyle={{marginLeft:15,marginRight:15}}
      />
      </KeyboardAvoidingView>
      <View style={{ marginLeft: 7, marginTop: 7, flexDirection: 'row',justifyContent:'center' }}>
                            <View style={{ flexBasis: '80%' }}>
                                <Dropdown containerStyle={{ marginLeft: 3, marginRight: 8, width: '100%',alignSelf:'center' }}
                                    label='País'
                                    itemTextStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                    value={this.state.country}
                                    data={this.state.countryData}
                                    onChangeText={text => this.setState({ country: text,updated:true })}
                                />
                            </View>
                        </View>
     
  </View>
  <View style={{marginTop:10,marginBottom:10,flex:1,justifyContent:"space-around",flexDirection:'row'}}>
        <View>
        <TouchableOpacity disabled={this.state.uploading} onPress={()=>{this.setState({showModal:true})}} style={{height:hp('5%'),backgroundColor:'#701f29',alignItems:'center',justifyContent:'center',borderRadius:15,width:wp('60%')}}>
    {this.state.uploading===false && <Text style={{color:'white',fontSize:16}}>Cambia la contraseña</Text>}
    {this.state.uploading===true && <ActivityIndicator size={Platform.OS==='android'?20:1} animating color='white'/>}
  </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity disabled={this.state.uploading} onPress={this.handleSubmit} style={{height:hp('5%'),backgroundColor:'darkred',alignItems:'center',justifyContent:'center',borderRadius:15,width:wp('30%')}}>
    {this.state.uploading===false && <Text style={{color:'white',fontSize:16}}>ENVIAR</Text>}
    {this.state.uploading===true && <ActivityIndicator size={Platform.OS==='android'?20:1} animating color='white'/>}
  </TouchableOpacity>
        </View>
  </View>
        </ScrollView>
  <Modal
  isVisible={this.state.showModal}

  onBackdropPress={()=>this.setState({showModal:false})}
  >
    <View style={{ backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',}}>

    <Text style={{fontSize:16}}>Actualiza contraseña</Text>
        <KeyboardAvoidingView>
  <TextField
        label='Contraseña anterior'
        value={this.state.password}
        onChangeText={ (password) => this.setState({ password }) }
        tintColor="darkred"
        secureTextEntry={true}
        autoCapitalize='none'
        
        containerStyle={{marginLeft:15,marginRight:15}}
        />
      </KeyboardAvoidingView>    
      <KeyboardAvoidingView>
  <TextField
        label='Nueva contraseña'
        value={this.state.newPassowrd}
        onChangeText={ (newPassowrd) => this.setState({ newPassowrd}) }
        tintColor="darkred"
        secureTextEntry={true}

        autoCapitalize='none'
        containerStyle={{marginLeft:15,marginRight:15}}
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
  <TextField
        label='Confirmar contraseña'
        value={this.state.confirmPassword}
        secureTextEntry={true}

        onChangeText={ (confirmPassword) => this.setState({ confirmPassword}) }
        tintColor="darkred"
        autoCapitalize='none'
        containerStyle={{marginLeft:15,marginRight:15}}
        />
      </KeyboardAvoidingView>
      <TouchableOpacity disabled={this.state.uploading} onPress={this.handlePasswordReset} style={{height:hp('5%'),backgroundColor:'darkred',alignItems:'center',justifyContent:'center',borderRadius:15,alignSelf:'center',width:200,marginTop:10}}>
    {this.state.uploading===false && <Text style={{color:'white',fontSize:20}}>Actualiza contraseña</Text>}
    {this.state.uploading===true && <ActivityIndicator size={Platform.OS==='android'?20:1} animating color='white'/>}
  </TouchableOpacity>
 </View>
  </Modal>
          </SafeAreaView>
       )
     }
 }
 function mapStateToProps(state){
   return({
     UID:state.rootReducer.UID,
      userInfo:state.rootReducer.userInfo
  })
}
function mapActionsToProps(dispatch){
  return({
    setUserInfo:(info)=>{
      dispatch(setUserInfoAction(info))
    }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(UpdateProfile)
