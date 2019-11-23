import React, {Component} from 'react';
import {Text, View,ScrollView,TouchableOpacity,KeyboardAvoidingView,Image,ActivityIndicator,ToastAndroid,Platform,PermissionsAndroid,Alert} from 'react-native';
import {Icon,CheckBox} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown'
import ImagePicker from 'react-native-image-picker';
import {SafeAreaView} from 'react-navigation'
import {TextField} from 'react-native-material-textfield'
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import Firebase from 'react-native-firebase'
import { hideListingCategoriesAction,setShippingsAction } from "../store/actions/actions";
import { url } from "./Proxy";
 class ListingScreen extends Component{
     constructor(props){
         super(props)
         this.data=[
        {name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50},{name:'ios-add-circle',type:'ionicon',color:'#894d08',size:50}
        ]
        this.initialState ={    
          title:'',
        tradeYes:true,
 tradeNo:false,
 National:false,
 International:false,
 iconData:this.data,
 images:[],
 description:'',
 price:'',
 currency:'USD',
 UID:'',
 downlaodUrls:[],
 uploading:false,
 currentLongitude: 'unknown',//Initial Longitude
currentLatitude: 'unknown',//Initial Latitude,.
pickup:true
}
         this.state={
             ...this.initialState
         }
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.uploadImages=this.uploadImages.bind(this)
    this.handleDataUpload=this.handleDataUpload.bind(this)
     }
     setPickup=()=>{
       this.setState({
         pickup:true,
         International:false,
         National:false
       })
     }
     getNational=()=>{
      this.setState({
  National:!this.state.National,
  pickup:false
      })
    }
    componentDidMount=()=>{
      this.setState({
        UID:this.props.UID
      })
      var that =this;
  //Checking for the permission just after component loaded
  if(Platform.OS === 'ios'){
    this.callLocation(that);
  }else{
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
            'title': 'Se requiere acceso a la Ubicación',
            'message': 'Esta aplicación necesita acceder a su Ubicación'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          that.callLocation(that);
        } else {
          alert("Permiso denegado");
        }
      } catch (err) {
        alert("err",err);
        console.warn(err)
      }
    }
    requestLocationPermission();
  }    
    }
    
    selectPhotoTapped() {
      const options = {
        quality: 1.0,
        maxWidth: 800,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
      };
  
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);
  
        if (response.didCancel) {
          console.log('User cancelled photo picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let source = { uri: response.uri };
          let images = this.state.images
          images.push(source.uri)
          let iconData = this.state.iconData
          let data = {src:source.uri}
          iconData[images.length-1] = data
          this.setState({
            images,
            iconData
          })
        }
      });
    }
    callLocation(that){
      //alert("callLocation Called");
        navigator.geolocation.getCurrentPosition(
          //Will give you the current location
           (position) => {
              const currentLongitude = JSON.stringify(position.coords.longitude);
              //getting the Longitude from the location json
              const currentLatitude = JSON.stringify(position.coords.latitude);
              //getting the Latitude from the location json
              that.setState({ currentLongitude:currentLongitude });
              //Setting state Longitude to re re-render the Longitude Text
              that.setState({ currentLatitude:currentLatitude });
              //Setting state Latitude to re re-render the Longitude Text
           },
           (error) => {
            if(error.message=="Location request timed out")
             {
               return
              }
             else if(error.message.includes('provider')){
             Alert.alert('Ha fallado',"El usuario debe habilitar la ubicación")
             this.props.navigation.navigate('HomeScreen')
             }
             else
             Alert.alert('Ha fallado',error.message)
           },
           { enableHighAccuracy: true, timeout: 20000 }
        );
        that.watchID = navigator.geolocation.watchPosition((position) => {
          //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
           that.setState({ currentLongitude:currentLongitude });
           //Setting state Longitude to re re-render the Longitude Text
           that.setState({ currentLatitude:currentLatitude });
           

           if(this.state.currentLatitude!=='unknown')
           {
             navigator.geolocation.clearWatch(this.watchID);
             navigator.geolocation.stopObserving();
           }
           //Setting state Latitude to re re-render the Longitude Text
        },err=>{
          if(err.message.includes('out'))
          return
        });
     }
     componentWillUnmount=()=>{
      navigator.geolocation.clearWatch(this.watchID);
   }    
    uploadImages(){
      this.setState({uploading:true})
      let images = this.state.images
      if(this.state.UID!=='')
      images.map((image)=>{
        let storage = Firebase.storage()
        let storageRef = storage.ref(`artisan/${this.state.UID}/image`+Date.now())
        let task = storageRef.putFile(image)
        task.on('state_changed', function (snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //   console.log('Upload is ' + progress.toFixed(2) + '% done');
          switch (snapshot.state) {
            case Firebase.storage.TaskState.PAUSED: // or 'paused'
              //   console.log('Upload is paused');
              break;
            case Firebase.storage.TaskState.RUNNING: // or 'running'
                console.log(progress);
              break;
              default:
              return
          }
        }, function (error) {
          alert(error.message)
        }, () => {
          storageRef.getDownloadURL().then((downloadURL) => {
            let oldUrls = this.state.downlaodUrls
            oldUrls.push(downloadURL)
            this.setState({
              downlaodUrls: oldUrls
            })
            if (this.state.downlaodUrls.length === this.state.images.length) {
              this.handleDataUpload()
            }
          });
        })
      })
    }
    handleDataUpload(){
      let trade = false
      if(this.state.tradeYes===true)
      trade=true
      const data = {
        title:this.state.title,
        description:this.state.description,
        price:parseInt(this.state.price),
        trade,
        shippingNational:this.state.National,
        shippingInternational:this.state.International,
        imageLinks:this.state.downlaodUrls,
        firebaseUID:this.state.UID,
        Category:this.props.selectedCategory,
        subCategory:this.props.selectedSubCategory,
        location:{
          longitude:this.state.currentLongitude,
          latitude:this.state.currentLatitude
        },
        currency:this.state.currency,
        accountID:this.props.paymentInfo!==null?this.props.paymentInfo.accountID:''
      }
      fetch(url+'/api/addListing',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(resData=>{
              this.setState({loading:false,showLogo:false})
              if(resData.error)
              Alert.alert("Failed",resData.message)
              else
              {
                console.log(resData)
                this.setState({uploading:false})
                if(Platform.OS==='android'){
                  ToastAndroid.showWithGravityAndOffset(
                    'Carga Completa!',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );
                }
                this.props.navigation.navigate('HomeScreen')
                this.setState({
                  ...this.initialState
                })
              }
            }).catch(err=>console.log(err))
    }
    getInternational=()=>{
      this.setState({
        International:!this.state.International,
        pickup:false
      })
    }
    doTrade = ()=>{
      this.setState({
      tradeYes:!this.state.tradeYes,
      tradeNo:!this.state.tradeNo
      })
      }
      selectShipping(){
       if(this.state.International===true&&this.state.National===true){
        let query = {
          id:this.props.UID,
          type:'both'
        }
        this.fetchShippings(query)
       }
       else{
        if(this.state.International===true){
          let query = {
            id:this.props.UID,
            type:'international'
          }
          this.fetchShippings(query)
        }
        else if(this.state.National===true){
          let query = {
            id:this.props.UID,
            type:'domestic'
          }
          this.fetchShippings(query)
        }
       }
      }
      fetchShippings(query){
        fetch(url+'/api/getFilteredShippings',{method:"POST",body:JSON.stringify(query),headers: { "Content-Type": "application/json" }})
        .then(res=>res.json())
        .then(data=>{
          if(data.message==='Success'){
            if(data.docs.length>0){
              this.props.setShippings(data.docs)
              this.props.navigation.navigate('ShippingsScreen')
            }
          }
        })
      }
     render() {
       return (
        <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',borderBottomColor:'gray',borderBottomWidth:2,paddingBottom:5}}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('HomeScreen')}><Text style={{fontSize:30,marginLeft:10,marginTop:10}}>X</Text></TouchableOpacity>
        <Text style={{fontSize:20,marginLeft:20,marginTop:20,fontWeight:'bold'}}>AÑADIR LISTADO</Text>
        <Icon
        name='ios-arrow-dropdown'
        type='ionicon'
        color='black'
        size={15}
        containerStyle={{marginTop:28,marginLeft:10}}
         />
        </View>
        <ScrollView>
        {this.state.images.length===0 && <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
            <Text style={{fontSize:20,textAlign:'center',fontWeight:'bold'}}>Agregar Fotos</Text>
          
          </View>
        }
        <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',marginTop:10,flexWrap:'wrap',alignItems:'center',marginBottom:10}}>
          {this.state.iconData.map((data,index)=>{
            if(data.hasOwnProperty('color'))
            return <Icon
            key={'img'+index}
            size={data.size}
            color={data.color}
            type={data.type}
            onPress={this.selectPhotoTapped}
            containerStyle={{flexBasis:'20%'}}
            name={data.name}
            />
            else
            return <View

            key={'image'+index} style={{flex:1,flexBasis:'20%'}}>
        <Image
        source={{uri:data.src}}
        style={{display:'flex',height:'80%',width:'80%',borderColor:'#ffdebf',borderWidth:0.3,margin:5,borderRadius:40}}       
        />
        </View>
          })}
</View>
        
        <View style={{marginTop:40}}>
    <KeyboardAvoidingView>
  <TextField
        label='Título'
        value={this.state.title}
        onChangeText={ (title) => this.setState({ title }) }
        tintColor="darkred"
        containerStyle={{marginLeft:15,marginRight:15}}
      />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
        <TextField
         label='Descripción'
        value={this.state.description}
        onChangeText={ (description) => this.setState({ description }) }
        tintColor="darkred"
        containerStyle={{marginLeft:15,marginRight:15}}
   characterRestriction={600}
      />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView>
      <TextField
        label='Precio'
        tintColor="darkred"
        containerStyle={{marginLeft:7,marginRight:15}}
        value={this.state.price}
        keyboardType='numeric'
        onChangeText={ (price) => this.setState({ price }) }
      />
      </KeyboardAvoidingView>

      <View style={{width:'100%',height:hp('9%'),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
         <Text style={{marginLeft:10,color:'gray',fontSize:15,fontWeight:'bold'}}>Acceptar Intercambio?</Text>
      </View>
      <View style={{width:'100%',height:hp('11%'),backgroundColor:'white',flexDirection:'row'}}>
      <CheckBox
  title='Si'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.tradeYes}
  onPress={this.doTrade}
  checkedColor='darkred'
  containerStyle={{marginLeft:25,backgroundColor:'white',borderWidth:0}}
/>
<CheckBox
  center
  title='No'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.tradeNo}
  onPress={this.doTrade}
  containerStyle={{marginLeft:25,backgroundColor:'white',borderWidth:0}}
  checkedColor='darkred'
/>

      </View>
      {this.props.selectedCategory!=='Servicios' && <View style={{marginBottom:10}}>
      <View style={{width:'100%',height:hp('9%'),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
         <Text style={{marginLeft:10,color:'gray',fontSize:15,fontWeight:'bold'}}>Envio (Tipo de Envio)</Text>
      </View>
      <View style={{width:'100%',height:hp('11%'),backgroundColor:'white',flexDirection:'row',justifyContent:'space-evenly',flexWrap:'wrap'}}>
      <CheckBox
  title='Nacional'
 checked={this.state.National}
checkedColor='darkred'
containerStyle={{backgroundColor:'white',borderWidth:0}}

onPress={this.getNational}
/>
<CheckBox
  center
  title='Internacional'
  checked={this.state.International}
  containerStyle={{backgroundColor:'white',borderWidth:0}}
  checkedColor='darkred'
  onPress={this.getInternational}
/>
<CheckBox
  center
  title='Para Recoger (locamente)'
  checked={this.state.pickup}
  containerStyle={{backgroundColor:'white',borderWidth:0}}
  checkedColor='darkred'
  onPress={this.setPickup}
/>

      </View>
      </View>}
  </View>
  {(this.state.International===true || this.state.National===true)&&<View onTouchEnd={this.selectShipping} style={{ borderBottomColor: 'black', borderBottomWidth: 0.5, marginTop: 30, flexDirection: 'row', paddingBottom: 10 }}>
            <Text style={{ color: 'darkred', fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginBottom: 5, flexBasis: "70%" }}>Elegir Perfil de Envio</Text>
            <Icon
              containerStyle={{ flexBasis: '30%', marginTop: 5 }}
              name='ios-arrow-dropright-circle'
              type='ionicon'
              color='darkred'
              size={22}

            />
          </View>}
  {this.props.selectedShipping!==null && <View>
    {this.props.selectedShipping.type==='both' && <View style={{flex:1,marginTop:5,marginBottom:10,borderBottomColor:'darkred',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Envio Detalles</Text>
        <Text style={{fontSize:22,fontWeight:'bold',textAlign:'center',marginTop:5}}>{this.props.selectedShipping.title}</Text>
        <View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Nacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.selectedShipping.domesticService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.selectedShipping.domDelivery.from} to {this.props.selectedShipping.domDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los cargos : {this.props.selectedShipping.domCost}</Text>
        </View>
        <View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Internacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.selectedShipping.internationalService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.selectedShipping.intDelivery.from} to {this.props.selectedShipping.intDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los cargos : ${this.props.selectedShipping.intCost}</Text>
        </View>
       </View>}
    {this.props.selectedShipping.type==='domestic' && <View style={{flex:1,Detalles:5,marginBottom:10,borderBottomColor:'darkred',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Envio Details</Text>
        <Text style={{fontSize:22,fontWeight:'bold',textAlign:'center',marginTop:5}}>{this.props.selectedShipping.title}</Text>
        <View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Nacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.selectedShipping.domesticService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.selectedShipping.domDelivery.from} to {this.props.selectedShipping.domDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los cargos : {this.props.selectedShipping.domCost}</Text>
        </View>
       </View>}
  {this.props.selectedShipping.type==='international' && <View style={{flex:1,marginTop:5,marginBottom:10,borderBottomColor:'darkred',borderBottomWidth:1}}>
        <Text style={{fontSize:16,fontWeight:'bold',textAlign:'center'}}>Envio Detalles</Text>
        <Text style={{fontSize:22,fontWeight:'bold',textAlign:'center',marginTop:5}}>{this.props.selectedShipping.title}</Text>
        <View style={{width:'80%',alignSelf:'center',marginTop:4}}>
        <Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>Internacional</Text>
        <Text style={{textAlign:'center'}}>Entrega Servicio : {this.props.selectedShipping.internationalService}</Text>
        <Text style={{textAlign:'center'}}>Entrega Hora : {this.props.selectedShipping.intDelivery.from} to {this.props.selectedShipping.intDelivery.to} dias</Text>
        <Text style={{textAlign:'center'}}>Entrega Los cargos : ${this.props.selectedShipping.intCost}</Text>
        </View>
       </View>}
  </View>}
  <View style={{alignItems:'center',marginTop:10,marginBottom:10}}>
  <TouchableOpacity disabled={this.state.uploading} onPress={this.uploadImages} style={{width:wp('90%'),height:hp('4%'),backgroundColor:'darkred',borderRadius:15,alignItems:'center',justifyContent:'center'}}>
    {this.state.uploading===false && <Text style={{color:'white',fontSize:20}}>Publicar</Text>}
    {this.state.uploading===true && <ActivityIndicator size={10} animating color='white'/>}
  </TouchableOpacity>
  </View>
        </ScrollView>
          </SafeAreaView>
       )
     }
 }
 function mapStateToProps(state){
  return({
      selectedCategory:state.rootReducer.selectedCategory,
      UID:state.rootReducer.UID,
      selectedShipping:state.rootReducer.selectedShipping,
      selectedSubCategory:state.rootReducer.selectedSubCategory,
      paymentInfo:state.rootReducer.paymentInfo
  })
}
function mapActionsToProps(dispatch){
  return({
      hideListingCategories:()=>{
        dispatch(hideListingCategoriesAction())
      },
      setShippings:(shippings)=>{
        dispatch(setShippingsAction(shippings))
      }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(ListingScreen)
