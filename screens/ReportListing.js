/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {View,KeyboardAvoidingView,SafeAreaView,Alert,Platform,ToastAndroid,ActivityIndicator} from 'react-native';
import {Header,Button,CheckBox} from 'react-native-elements';
import {TextField} from 'react-native-material-textfield'
import { connect } from 'react-redux';
import { url } from "./Proxy";
import { addtListingsAction,showDescriptionModalAction } from "../store/actions/actions";

class ReportListng extends Component {
     constructor(props){
         super(props)
         this.state={
             description:'',
            option1:true,
            option2:false,
            option3:false,
            option4:false,
            title:'',
            loading:false,
            page:1
         }
         this.handleSubmit=this.handleSubmit.bind(this)
     }
     handleSubmit(){
         this.setState({
             loading:true
         })
        if(this.props.flagData!==null){
            let data = {
                ...this.props.flagData,
                description:this.state.description,
                title:this.state.title
            }
            fetch(url+'/api/reportListing',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
            .then(res=>res.json())
            .then(response=>{
                if(response.message==='Failed'){
                    Alert.alert('Failed',response.err)
                }
                else{
                    if(Platform.OS==='android'){
                        ToastAndroid.showWithGravityAndOffset(
                          'El listado ha sido reportado. Tomaremos las medidas adecuadas en breve.!',
                          ToastAndroid.LONG,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }
                else{
                    Alert.alert('Success',"El listado ha sido reportado. Tomaremos las medidas adecuadas en breve.!")
                }
                fetch(url+'/api/getListings'+this.state.page,{method:"POST",headers: { "Content-Type": "application/json" }}).then(res=>res.json())
                .then(response=>{
                  this.props.addtListings({
                    page:this.state.page,
                    listings:response.data
                  })
                  this.setState({
                    loading:false
                  })
                  this.props.navigation.navigate('HomeScreen')
                }).catch(err=>console.log(err))
                }
            }).catch(err=>console.log(err))
        }
     }
  render() {
      if(this.state.loading){
          return(  <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator
              size={Platform.OS === "android" ? 30 : 1}
              color="darkred"
              animating
            />
          </View>
          )
      }
  else return (
      <SafeAreaView style={{flex:1}}>
      <Header  placement="left"
                  leftComponent={
                    { text: 'X', style: { color: 'black',fontSize:22,marginBottom:13,fontWeight:'bold'},onPress:()=>{
                      this.props.navigation.goBack()
                      this.props.showDescriptionModal()
                    } }
                  }
                  centerComponent={{ text: 'Listado de informes', style: { color: 'black',fontSize:18,alignItems:'center'} }}
                  containerStyle={{backgroundColor:'white'}}
                  />
                       <CheckBox
  title='Listado falso'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.option1}
  onPress={()=>{
      this.setState({
        option1:true,
        option2:false,
        option3:false,
        option4:false,
        title:'Fake Listing'
      })
  }}
  checkedColor='darkred'
  containerStyle={{marginTop:10}}
/>
<CheckBox
  title='Fraude / Estafa'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.option2}
  onPress={()=>{
    this.setState({
        option1:false,
        option2:true,
        option3:false,
        option4:false,
        title:'Fraud/Scam'
      })
  }}
  checkedColor='darkred'
  containerStyle={{marginTop:10}}
/>
<CheckBox
  title='Contenido inapropiado'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.option3}
  onPress={()=>{
    this.setState({
        option1:false,
        option2:false,
        option3:true,
        option4:false,
        title:'Inappropriate Content'
      })
  }}
  checkedColor='darkred'
  containerStyle={{marginTop:10}}
/>
<CheckBox
  title='Otro'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={this.state.option4}
  onPress={()=>{
    this.setState({
        option1:false,
        option2:false,
        option3:false,
        option4:true,
        title:'Other'
      })
  }}
  checkedColor='darkred'
  containerStyle={{marginTop:10}}
/>

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
      <View style={{alignItems:'center',justifyContenty:'center'}}>
            <Button title="Informe" onPress={this.handleSubmit} containerStyle={{borderRadius:30,width:'50%',marginTop:15}}  buttonStyle={{backgroundColor:'darkred'}} />
         </View>
      </SafeAreaView>
    )
  }
}
function mapStateToProps(state){
    return({
      firebaseUID:state.rootReducer.UID,
      flagData:state.rootReducer.flagData
    })
  }
  function mapActionsToProps(dispatch){
    return({
       addtListings:(listings)=>{
           dispatch(addtListingsAction(listings))
       },
       showDescriptionModal: () => {
         dispatch(showDescriptionModalAction());;
       }
    })
  }
  export default connect(mapStateToProps,mapActionsToProps)(ReportListng)