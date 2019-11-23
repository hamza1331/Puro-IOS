import React, {Component} from 'react';
import {AsyncStorage, Text, View,ScrollView,StyleSheet} from 'react-native';
import {Header,Icon} from 'react-native-elements';
import Modal from 'react-native-modal'
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import Slideshow from 'react-native-image-slider-show';
import { hideOrderModalAction } from "../store/actions/actions";
class OrderDetails extends Component {
constructor(props){
  super(props);
  this.state={
    buyerFname:'Test',
    imageLinks:[],
    amount:''
  }
}
componentDidMount(){
  AsyncStorage.getItem('userData').then(response=>{
    if(response!==null){
      let user = JSON.parse(response)
      this.setState({
        buyerProfilePic:user.profilePic,
        buyerName:user.fName
      })
   }
   })
}
  
    render(){ 
      
      if(this.props.order===null)
      {
        return(
          <Modal isVisible={this.props.showOrder}>
            <Text>Hello From App..</Text>
          </Modal>
        )
      }

     else {
        let imageLinks = [this.props.order.imageLink]
        let amount = (parseInt(this.props.order.amount))/100
      return(
        <Modal isVisible={this.props.showOrder} 
        onBackButtonPress={()=>this.props.hideOrderModal()}
        style={{borderRadius:15,
            backgroundColor:'#F3F3F5',
            margin:0
            }}>
            <SafeAreaView style={{flex:1}}>
            <Header 
            leftComponent={
          <Icon  containerStyle={{marginBottom:8}}
          name="ios-arrow-round-back"
          type="ionicon"
          color="black"
          size={40}
          onPress={()=>this.props.hideOrderModal()}
          />
            }
            
            containerStyle={{backgroundColor:'#F3F3F5', borderTopLeftRadius:15,
            borderTopRightRadius:15}}
            />
              <ScrollView>
                <View >
                {this.props.order!==null && <Slideshow 
           dataSource={imageLinks.map((image,index)=>{
                return {
                  url:image
                }
           })}
           />}
     
             </View>
            <View style={{marginLeft:10,marginTop:10,paddingBottom:5,borderBottomColor:'gray',borderBottomWidth:2,marginRight:10}}>
              <Text style={{fontSize:50,fontWeight:'bold',color:'black'}} >{this.props.order.title}</Text>
              {this.props.order!==null && <Text style={{fontSize:30,fontWeight:'bold',color:'black'}} >${amount}</Text>}
        
            </View>
            <View style={{marginLeft:10,marginTop:10,paddingBottom:5,borderBottomColor:'gray',borderBottomWidth:2,marginRight:10}}>
              <Text style={{fontSize:30,fontWeight:'bold',color:'black'}} >Orden Fecha</Text>
              <Text style={{fontSize:20,fontWeight:'bold',color:'black',textAlign:'center'}}>{this.props.order.createdDate.toString().substring(0,10)}</Text>
              <Text style={{fontSize:30,fontWeight:'bold',color:'black'}} >Facturación Nombre</Text>
              <Text style={{fontSize:20,fontWeight:'bold',color:'black',textAlign:'center'}}>{this.props.order.buyerName}</Text>
              <Text style={{fontSize:30,fontWeight:'bold',color:'black'}} >Facturación Dirección</Text>
              <Text style={{fontSize:20,fontWeight:'bold',color:'black',textAlign:'center'}}>{this.props.order.shippingAddress}</Text>
              <Text style={{fontSize:30,fontWeight:'bold',color:'black',marginTop:5}} >Producto Descripcion</Text>
              <Text style={{fontSize:15,color:'black'}}>{this.props.order.description}.</Text>
        
            </View>
            
            </ScrollView>
        </SafeAreaView>
        </Modal>
           )
     }
    }
   }
   function mapStateToProps(state){
    return({
      order:state.rootReducer.order,
      UID:state.rootReducer.UID,
      showOrder:state.rootReducer.showOrder
    })
  }
  function mapActionsToProps(dispatch){
    return({
      hideOrderModal:()=>{
        dispatch(hideOrderModalAction())
      }
    })
  }
  export default connect(mapStateToProps,mapActionsToProps)(OrderDetails)
  const styles = StyleSheet.create({
 
    MainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : '#F5F5F5'
    },
   
    TouchableOpacityStyle:{
   
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 60,
    },
   
    FloatingButtonStyle: {
   
      resizeMode: 'contain',
      width: 60,
      height: 60,
    }
  });