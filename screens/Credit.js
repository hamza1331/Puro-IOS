import React, {Component} from 'react';
import {Text, View,ScrollView,TouchableOpacity,KeyboardAvoidingView,AsyncStorage,ActivityIndicator,ToastAndroid,Platform,Alert} from 'react-native';
import { Icon,CheckBox,Header } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import {TextField} from 'react-native-material-textfield'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { url } from "./Proxy";
import Stripe from 'react-native-stripe-api';

const apiKey = 'pk_live_CcUK62qR7iD5ObbtumrdKI1U000PBiKFcJ';
const client = new Stripe(apiKey);
import { CreditCardInput } from "react-native-credit-card-input";
 class Credit extends Component{
     constructor(props){
         super(props)
        this.initialState ={    
            title:'',
            description:'',
            option:'Suggestion',
            uploading:false,
            userData:null,
            number:'',
            exp_month:'',
            exp_year:'',
            cvc:'',
            address_zip:'12345',
            national:true,
            international:false,
            cost: this.props.item.doc.price+this.props.item.shipping.domCost,
            email:'',
            loading:false,
            line1:''
            }
         this.state={
             ...this.initialState
         }
         this.handleSubmit=this.handleSubmit.bind(this)
         this.showNational=this.showNational.bind(this)
         this.showInternational=this.showInternational.bind(this)
        }
     showInternational() {
       let cost = this.props.item.doc.price+this.props.item.shipping.intCost
      this.setState({
          international: true,
          national: false,
          cost
      })
  }
     showNational() {
      let cost = this.props.item.doc.price+this.props.item.shipping.domCost
      this.setState({
          international: false,
          national: true,
          cost
      })
  }
     componentDidMount(){
        AsyncStorage.getItem('userData').then(response=>{
            if(response!==null){
              let user = JSON.parse(response)
             this.setState({
                 userData:user
             })
           }
           })
           
     }
    async handleSubmit(){

      this.setState({
        loading:true
      })
        const token = await client.createToken({
            number: this.state.number ,
            exp_month: this.state.exp_month, 
            exp_year: this.state.exp_year, 
            cvc: this.state.cvc,
            address_zip: '12345'
         });
        
         let listingData = {
          title:this.props.item.doc.title,
        description:this.props.item.doc.description,
        listingID:this.props.item.doc._id,
        sellerFirebaseUID:this.props.item.doc.firebaseUID,
        Category:this.props.item.doc.Category,
        sellerName:this.props.item.userData.fName,
        buyerFirebaseUID:this.props.UID,
        buyerName:this.state.userData!==null?this.state.userData.fName:"Test",
        shippingAddress:this.state.line1,
        amount:(Math.round(this.state.cost+0.10))*100,
        token:{
          email:this.state.email,
          id:token.id
        },
        imageLink:this.props.item.doc.imageLinks[0],
        accountID:this.props.item.doc.accountID?this.props.item.doc.accountID:''
        }
         fetch(url+'/paym',{method:"POST",body:JSON.stringify(listingData),headers: { "Content-Type": "application/json" }})
    .then(res=>res.json())
    .then(data=>{
      if(data.message==='Success'){
        this.setState({
          loading:false
        })
        if(Platform.OS==='android'){
          ToastAndroid.showWithGravityAndOffset(
            'Cantidad Pagada!!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
        this.props.navigation.navigate('HomeScreen')
      }
      else{
        Alert.alert('Ha fallado',"Unknown Error")
      }
    })
     }
     componentDidMount(){
      AsyncStorage.getItem('userData').then(response=>{
        if(response!==null){
          let user = JSON.parse(response)
          this.setState({
            buyerProfilePic:user.profilePic,
            buyerName:user.fName,
            email:user.email
          })
       }
       })
    }
     _onChange = form => {
        console.log(form);
        let {status} = form
        if(status.number==='valid'&&status.cvc==='valid'&& status.expiry==='valid'){
            let data = form
            let dates = data.values.expiry.split('/')
            this.setState({
                number:data.values.number,
                exp_month:dates[0],
                exp_year:dates[1],
                cvc:data.values.cvc
            })
        }

     }
     render() {
     if(this.state.loading){
       return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator animating size={40} color='darkred'/>
    </View>
       )
     }
     else return (
        <SafeAreaView style={{flex:1}}>
          <ScrollView style={{marginTop:10,marginBottom:10}}>

        <CreditCardInput allowScroll onChange={this._onChange}  />
           <View style={{ width: '100%', height: hp('11%'), backgroundColor: 'white', flexDirection: 'row',justifyContent:'space-evenly' }}>
                        <CheckBox
                            title='Envios Nacionales'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.national}
                            onPress={this.showNational}
                            checkedColor='darkred'
                            containerStyle={{  backgroundColor: 'white', borderWidth: 0 }}
                            />
                        <CheckBox
                            center
                            title='Envios Internacional'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.international}
                            onPress={this.showInternational}
                            containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                            checkedColor='darkred'
                            />
                    </View>
                    <KeyboardAvoidingView>
                            <TextField
                                label='Nombre'
                                value={this.state.first_name}
                                onChangeText={(first_name) => this.setState({ first_name })}
                                tintColor="darkred"
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView>
                            <TextField
                                label='Dirección'
                                value={this.state.line1}
                                onChangeText={(line1) => this.setState({ line1 })}
                                tintColor="darkred"
                                placeholder='Dirección'
                                containerStyle={{ marginLeft: 15, marginRight: 15 }}
                                characterRestriction={600}
                                />
                        </KeyboardAvoidingView>
        <View style={{flex:1,marginTop:5,marginBottom:10,borderBottomColor:'darkred',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Entrega Detalles</Text>
        {this.state.national&&<View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Nacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.item.shipping.domesticService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.item.shipping.domDelivery.from} a {this.props.item.shipping.domDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los Cargos : {this.props.item.shipping.domCost}</Text>
        </View>}
        {this.state.international && <View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Internacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.item.shipping.internationalService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.item.shipping.intDelivery.from} a {this.props.item.shipping.intDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los Cargos : ${this.props.item.shipping.intCost}</Text>
        </View>}
       </View>
       <View style={{width:'80%',alignSelf:'center',marginTop:5}}>
        <Text style={{fontSize:20,fontWeight:'bold',textDecorationLine:'underline'}}>TOTAL</Text>
        <Text style={{textAlign:'center',fontSize:18}}>$ {this.state.cost}</Text>
        </View>

    </ScrollView>
        <View onTouchEnd={this.handleSubmit} style={{backgroundColor:'#D1802E',height:50,width:'100%',alignItems:'center',justifyContent:'center'}}>
       <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Pagar</Text>
         </View>
          </SafeAreaView>
       )
     }
 }
 function mapStateToProps(state){
  return({
      UID:state.rootReducer.UID,
      item:state.rootReducer.item
  })
}
function mapActionsToProps(dispatch){
  return({
      
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Credit)
