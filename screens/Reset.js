/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {Component} from 'react';
import { View,ScrollView,Image,KeyboardAvoidingView,Dimensions,Text,ActivityIndicator,Alert,AsyncStorage,Platform} from 'react-native';
import {Button} from 'react-native-elements';
import {TextField} from 'react-native-material-textfield'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase'
import { url } from "./Proxy";
import { connect } from "react-redux";
import { setUIDAction,setUserInfoAction } from "../store/actions/actions";
class Reset extends Component{
    constructor(props){
      super(props)
      this.state={
        pass:"",
        email:'',
        orientation:'',
        loading:false,
        showLogo:false
    }
      this.handleSubmit=this.handleSubmit.bind(this)
      this.handleReset=this.handleReset.bind(this)
      }
      getOrientation = () =>
      {
        if( this.refs.rootView )
        {
            if( Dimensions.get('window').width < Dimensions.get('window').height )
            {
              this.setState({ orientation: 'portrait' });
            }
            else
            {
              this.setState({ orientation: 'landscape' });
            }
        }
      }
      handleSubmit(){
       if(this.state.email.includes('@')){
        this.setState({
            loading:true
          })  
          const auth = firebase.auth();
          const emailAddress = this.state.email;

auth.sendPasswordResetEmail(emailAddress).then(()=> {
  // Email sent.
  this.setState({
      loading:false,
      email:''
  })
  Alert.alert("Éxito","El correo electrónico de contraseña ha sido enviado a "+this.state.email+'. Por favor revise su bandeja de entrada')
  this.props.navigation.goBack()
}).catch((error)=> {
  // An error happened.
  Alert.alert("Ha fallado","Solicitud de reinicio fallida")
});
       }
       else{
           Alert.alert("Ha fallado","Ingrese una dirección de correo electrónico válida")
       }
      }
      componentDidMount() {
        loc(this);
        this.getOrientation();
    
        Dimensions.addEventListener( 'change', () =>
        {
          this.getOrientation();
        });
      
      }
      handleReset(){
        
      }
      componentWillUnMount() {
        rol();
      }
      render(){
        if(this.state.loading===false&&this.state.showLogo==false)
        return(
          <ScrollView ref="rootView" style={{flex:1,backgroundColor:'white'}}>
          <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('35%'):hp('88.5%')}}>
          <Image 
          source={require('./my1.png')}
          style={{width:wp('80%'),height:(this.state.orientation==="portrait")?hp('35%'):hp('89%')}}
          />
          </View>
          <View   style={{width:wp('100%'),height:hp('15%')}}>
          <TextField 
          label='Email'
          value={this.state.email}
          onChangeText={ (email) => this.setState({ email }) }
          tintColor="darkred"
          autoCapitalize='none'
          containerStyle={{marginLeft:15,marginRight:15,marginTop:2}}
          keyboardType='email-address'
        />
          </View>
        
        
        <KeyboardAvoidingView style={{alignItems:'center',width:wp('100%'),height:(this.state.orientation==="portrait")?hp('30%'):hp('50%')}}>
        <Button title="Restablecer la contraseña" onPress={this.handleSubmit} containerStyle={{borderRadius:15}}  buttonStyle={{backgroundColor:'darkred',borderRadius:10}} />
       </KeyboardAvoidingView>
   </ScrollView>
      
        )
        else if(this.state.showLogo===false&&this.state.loading===true)
        return(
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator animating size={Platform.OS==='android'?40:1} color='purple'/>
          </View>
        )
      }
}

function mapStateToProps(state){
  return({
  })
}
function mapActionsToProps(dispatch){
  return({
      setUID:(UID)=>{
        dispatch(setUIDAction(UID))
      },
      setUserInfo:(info)=>{
        dispatch(setUserInfoAction(info))
      }
  })
}

export default connect(mapStateToProps,mapActionsToProps)(Reset)