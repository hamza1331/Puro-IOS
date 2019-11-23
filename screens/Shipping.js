// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  * @lint-ignore-every XPLATJSCOPYRIGHT1
//  */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
// import React, {Component} from 'react';
// import { Platform, Text, View,ScrollView,ToastAndroid,ActivityIndicator,AsyncStorage} from 'react-native';
// import {Header,Icon} from 'react-native-elements';
// import {TextField} from 'react-native-material-textfield'

// import {Dropdown} from 'react-native-material-dropdown'
// import { SafeAreaView } from "react-navigation";
import { url } from "./Proxy";
import { connect } from "react-redux";
// class Shipping extends Component {
//   constructor(props){
//     super(props)
//     this. state = {
//       domCost:'0',
//       domDelivery:{
//         from:'0',
//         to:'0'
//       },
//       domesticService:"",
//       intCost:'0',
//       intDelivery:{
//         from:'0',
//         to:'0'
//       },
//       internationalService:"",
//       domAdditional:'0',
//       intAddtional:'0',
//       loading:false
//     }
//     this.handleSubmit=this.handleSubmit.bind(this)
//   }
//   componentDidMount(){
//     console.log(this.props.UID)
//     AsyncStorage.getItem('shippingProfile').then(data=>{
//       if(data!==null){
//         let shippingProfile = JSON.parse(data)
//         this.setState({
//           ...shippingProfile
//         })
//       }
//       else{
//         fetch(url+'/api/getShipping'+this.props.UID).then(res=>res.json()).then(response=>{
//           if(response.data){
//             const {data} = response
//             let shippingProfile = {
//               domCost:data.domCost.toString(),
//               domDelivery:{
//                 from:data.domDelivery.from.toString(),
//                 to:data.domDelivery.to.toString()
//               },
//               domesticService:data.domesticService,
//               intCost:data.intCost.toString(),
//               intDelivery:{
//                 from:data.intDelivery.from.toString(),
//                 to:data.intDelivery.to.toString()
//               },
//               internationalService:data.internationalService,
//               domAdditional:data.domAdditional?data.domAdditional.toString():'',
//               intAddtional:data.intAddtional?data.intAddtional.toString():''
//             }
//             AsyncStorage.setItem('shippingProfile',JSON.stringify(shippingProfile))
//             this.setState({...shippingProfile})
//           }
//         })
//       }
//     })
//   }
//   handleSubmit(){
//     let data = this.state
//     this.setState({
//       loading:true
//     })
//     let shippingProfile = {
//       domCost:parseInt(data.domCost),
//       domDelivery:{
//         from:parseInt(data.domDelivery.from),
//         to:parseInt(data.domDelivery.to)
//       },
//       domesticService:data.domesticService,
//       intCost:parseInt(data.intCost),
//       intDelivery:{
//         from:parseInt(data.intDelivery.from),
//         to:parseInt(data.intDelivery.to)
//       },
//       internationalService:data.internationalService,
//       domAdditional:parseInt(data.domAdditional),
//       intAddtional:parseInt(data.intAddtional),
//       firebaseUID:this.props.UID
//     }
//     fetch(url+'/api/addShipping',{method:"PUT",body:JSON.stringify(shippingProfile),headers: { "Content-Type": "application/json" }}).then(res=>res.json()).then(response=>{
//       if(response.message==='Success'){
//         this.setState({
//           ...data,
//           loading:false
//         })
//         if(Platform.OS==='android'){
//           ToastAndroid.showWithGravityAndOffset(
//             'Shipping Profile Updated!!',
//             ToastAndroid.LONG,
//             ToastAndroid.BOTTOM,
//             25,
//             50,
//           );
//         }
//       }
//     }).catch(err=>console.log(err))
//   }
  
//   render() {
//     const Company=[{
//       value:'TCS'
//     }
//     ,{
//       value:'Fedex'
//     }
//     ,{
//       value:'TNTExpress'
//     }
//     ,{
//       value:'DHL'
//     }
//   ]
//     return (
//   <SafeAreaView style={{flex:1}}>
//      <Header placement="left"
//       leftComponent={
//     <Icon  containerStyle={{marginBottom:8}}
//     name="ios-arrow-round-back"
//     type="ionicon"
//     color="black"
//     size={40}
//     onPress={()=>this.props.navigation.navigate('Profile')}
  
//     />
//       }
//       centerComponent={{ text: 'Shipping', style: { color: '#B46617',fontSize:20,marginBottom:10} }}
//       containerStyle={{backgroundColor:'white', borderTopLeftRadius:15,
//       borderTopRightRadius:15
//     }}
//       />
//       <ScrollView>
//    <View style={{marginTop:25,marginLeft:15}}>
//               <Text style={{color:'darkorange',fontSize:30}}>Shipping Profile</Text>
//             </View>
//             <View style={{borderBottomColor:'gray',borderBottomWidth:1,paddingBottom:10}}>
//             <View style={{marginTop:15,marginLeft:15}}>
//               <Text style={{color:'darkred',fontSize:22}}>Domestic</Text>
//             </View>
// <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
//         label='Company'
//         value={this.state.domesticService}
//       data={Company}
//       onChangeText={text=>{this.setState({domesticService:text})}}
// />
// <TextField
//         label='The Cost'
//         suffix="$"
//         value={this.state.domCost}
//         onChangeText={(price) => this.setState({domCost:price }) }
//         tintColor="darkred"
//         keyboardType='numeric'
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       <TextField
//       suffix="$"
//         label='Fast Delivery Cost'
//         keyboardType='numeric'
//         onChangeText={ (price) => this.setState({domAdditional:price}) }
//         tintColor="darkred"
//         value={this.state.domAdditional}
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
//       <View style={{flexBasis:'45%'}}>
//       <TextField
//         label='Delivery Time'
//         keyboardType='numeric'
//         tintColor="darkred"
//         value={this.state.domDelivery.from}
//         onChangeText={text=>{
//           let {domDelivery} = this.state
//           domDelivery.from = text
//           this.setState({domDelivery})

//         }}
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       </View>
//       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
//       <Text style={{fontSize:20,fontWeight:'bold'}}>to</Text>
//       </View>
//       <View style={{flexBasis:'45%'}}>
//       <TextField
//         tintColor="darkred"
//         containerStyle={{marginLeft:15,marginRight:15}}
//         keyboardType='numeric'
//         label='Maximum time'
//         value={this.state.domDelivery.to}
//         onChangeText={text=>{
//           let {domDelivery} = this.state
//           domDelivery.to = text
//           this.setState({domDelivery})

//         }}
//       />
//       </View>
//       </View>
//       </View>
//       <View>
//             <View style={{marginTop:15,marginLeft:15}}>
//               <Text style={{color:'darkred',fontSize:22}}>International</Text>
//             </View>
// <Dropdown containerStyle={{marginLeft:15,marginRight:15}} 
//         label='Company'
//         value={this.state.internationalService}
//       data={Company}
//       onChangeText={text=>this.setState({internationalService:text})}
// />
// <TextField
//         label='Cost'
//         value={this.state.intCost}
//         onChangeText={(price) => this.setState({intCost:price }) }
//         keyboardType='numeric'
//         tintColor="darkred"
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       <TextField
//         label='Fast Delivery Cost'
//         value={this.state.intAddtional}
//         onChangeText={ (price) => this.setState({intAddtional:price}) }
//         keyboardType='numeric'
//         tintColor="darkred"
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       <View style={{marginLeft:7,marginTop:7,flexDirection:'row'}}>
//       <View style={{flexBasis:'45%'}}>
//       <TextField
//         label='Delivery Time'        
//         keyboardType='numeric'
//         tintColor="darkred"
//         value={this.state.intDelivery.from}
//         onChangeText={text=>{
//           let {intDelivery} = this.state
//           intDelivery.from = text
//           this.setState({intDelivery})

//         }}
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       </View>
//       <View style={{flexBasis:'10%',marginTop:35,paddingLeft:10}}>
//       <Text style={{fontSize:20,fontWeight:'bold'}}>to</Text>
//       </View>
//       <View style={{flexBasis:'45%'}}>
//       <TextField
//         keyboardType='numeric'
//         label='Maximum time'
//         tintColor="darkred"
//         value={this.state.intDelivery.to}
//         onChangeText={text=>{
//           let {intDelivery} = this.state
//           intDelivery.to = text
//           this.setState({intDelivery})

//         }}
//         containerStyle={{marginLeft:15,marginRight:15}}
//       />
//       </View>
//       </View>
//       </View>
//         </ScrollView>
//         <View onTouchEnd={this.handleSubmit} style={{backgroundColor:'#B46617',position: 'relative', left: 0, right: 0, bottom: 0,height:40,width:'100%',alignItems:'center',justifyContent:'center'}}>
//        {this.state.loading===false && <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>Save</Text>}
//        {this.state.loading && <ActivityIndicator size={18} color='white' animating/>}
//          </View>
//   </SafeAreaView>
   
//     )
//   }
// }
// function mapStateToProps(state){
//   return({
//     UID:state.rootReducer.UID
//   })
// }
// function mapActionsToProps(dispatch){
//   return({
   
//   })
// }
// export default connect(mapStateToProps,mapActionsToProps)(Shipping)

import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator,Alert,TouchableOpacity,Text,StyleSheet,Platform,ToastAndroid,SafeAreaView,Image } from 'react-native';
import { ListItem, SearchBar, Icon,Header,Input } from 'react-native-elements';
import { setShippingProfileAction} from "../store/actions/actions";
class Shipping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      searchText:''
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({loading:true})
    fetch(url+'/api/getShippings'+this.props.UID)
     .then(res=>res.json())
     .then(data=>{
      if(data.message==='Success'){
        this.setState({
          data: data.data,
          error: data.err || null,
          loading: false,
        });
        this.arrayholder = data.data;
      }
     }).catch(err=>{
      this.setState({ error:err, loading: false });
     }) 
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '10%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
      searchText:text
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };


  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={Platform.OS==='android'?30:1} />
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
      {this.state.data.length>0 &&   <Header
       backgroundColor='#F3F3F2'
           placement="left"
                  centerComponent={{alignItems:'center', text: 'Perfiles de Envío', style: { color: 'darkred',fontSize:22} }}
                  collapsable={true}
                  leftContainerStyle={{alignItems:'center'}}
                  centerContainerStyle={{alignItems:'center'}}
                  leftComponent={
                    <Icon  
                    name="ios-menu"
                    type="ionicon"
                    color="darkred"
                    size={Platform.OS==='ios'?30:40}
                     onPress={(e)=>{this.props.navigation.toggleDrawer(e)}}
                    />
                    }
                  />}
        {this.state.data.length===0 &&  <Header
       backgroundColor='#F3F3F2'
           placement="left"
           leftComponent={
            <Icon  
            name="ios-menu"
            type="ionicon"
            color="darkred"
            size={Platform.OS==='ios'?30:40}
             onPress={(e)=>{this.props.navigation.toggleDrawer(e)}}
            />
            }
           centerComponent={
            <Input 
            onChangeText={text=>this.searchFilterFunction(text)}
            returnKeyType='search'
           leftIcon={
             <Icon 
             name='ios-search'
                     type='ionicon'
                     color='darkred'
             />
           }
           placeholder="Buscar Perfiles de Envios"
             shake={true}
             inputContainerStyle={{width:"100%",backgroundColor:'white',borderRadius:12,borderBottomColor:'white'}}
             containerStyle={{height:45,flex:1,alignItems:'center'}}
             rightIcon={
               this.state.searchText.length>0&&<Icon
               name='clear'
               type='material'
               color='darkred'
               />
             }
           />}
           />
            }
        {this.state.data.length>0 && <FlatList
          data={this.state.data}
          onRefresh={this.makeRemoteRequest}
          refreshing={this.state.loading}
          renderItem={({ item }) => (
            <ListItem
            onPress={()=>{
              let profile = this.state.data.filter(profile => profile._id === item._id)
              this.props.setShippingProfile(profile[0])
              this.props.navigation.navigate('ShippingForm')
            }}
            rightIcon={
              <Icon
              name='clear'
              type='material'
              color='darkred'
              onPress={()=>{
                Alert.alert(
                  'Advertencia',
                  '¿De verdad quieres eliminar?',
                  [
                    {text: 'Borrar', onPress: () => {
                      fetch(url+'/api/deleteShipping'+item._id,{method:"DELETE",headers: { "Content-Type": "application/json" }})
                      .then(res=>res.json())
                      .then(response=>{
                        if(response.message==='Success'){
                          let profiles = this.state.data.filter(profile=>profile._id!==item._id)
                          this.setState({
                            data:profiles
                          })
                          if(Platform.OS==='android'){
                            ToastAndroid.showWithGravityAndOffset(
                              'Perfil de envío eliminado!!',
                              ToastAndroid.LONG,
                              ToastAndroid.BOTTOM,
                              25,
                              50,
                            );
                          }
                        }
                        else{

                        }
                      })
                    }, style: 'cancel'},
                    {text: 'Cancelar', onPress: () => {
                    } },
                  ]
                );
              }}
              />
            }
              title={`${item.title}`}
              subtitle={item.description.substring(0,100)}
              titleStyle={{fontSize:18,fontWeight:'bold'}}
            />
          )}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={this.renderSeparator}
        />}
        {this.state.data.length===0 && <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:16,color:'gray'}}>(+) Crea tu primer perfil de envío!</Text>
        </View>}
          <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.props.setShippingProfile(null)
        this.props.navigation.navigate('ShippingForm')
      }} 
          style={styles.TouchableOpacityStyle}>
          <Image
            //We are making FAB using TouchableOpacity with an image
            //We are using online image here
            source={{
              uri:
                'https://aboutreact.com/wp-content/uploads/2018/08/bc72de57b000a7037294b53d34c2cbd1.png',
            }}
            //You can use you project image Example below
            //source={require('./images/float-add-icon.png')}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({ 
  fab: { 
    position: 'absolute', 
    width: 56, 
    height: 56, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: 'darkred', 
    borderRadius: 30
    }, 
    fabIcon: { 
      fontSize: 40, 
      color: 'white' ,
      textAlign:'center'
    },
    TouchableOpacityStyle: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
    },
  
    FloatingButtonStyle: {
      resizeMode: 'contain',
      width: 50,
      height: 50,
      //backgroundColor:'black'
    },
});
function mapStateToProps(state){
  return({
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
   setShippingProfile:(profile)=>{
     dispatch(setShippingProfileAction(profile))
   }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Shipping);