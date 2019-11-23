import React, {Component} from 'react';
import {Platform, Text, View,FlatList,TouchableOpacity,StatusBar} from 'react-native';
import {Avatar,Header,Icon} from 'react-native-elements';
import { connect } from "react-redux";
import { url } from "./Proxy";
import OrderDetails from '../screens/OrderDetails'
import { showOrderModalAction,renderOrderAction } from "../store/actions/actions";
 class Orders extends Component{
   constructor(props){
      super(props)
      this.state={
         orders:[],
         refreshing:false
      }
      this.handleRefresh=this.handleRefresh.bind(this)
      this.fetchOrders=this.fetchOrders.bind(this)
   }
    componentDidMount(){
        if(this.props.UID){
            this.fetchOrders()
         }
    }
    handleRefresh(){
        this.setState({refreshing:true})
        this.fetchOrders()       
    }
    fetchOrders(){
        fetch(url+'/api/Orders'+this.props.UID).then(res=>res.json()).then(response=>{
            this.setState({
               orders:response.data,
               refreshing:false
            })
         }).catch(err=>console.log(err))
    }
    
     render(){
         return(
            <View style={{flex:1}}>
            <StatusBar barStyle='light-content'/>
            <Header  placement="left"
                  centerComponent={{ text: 'Pedidos', style: { color: 'white',fontSize:22,marginBottom:10} }}
                  containerStyle={{backgroundColor:'#4d2600',
                  }}
                  leftComponent={
                    <Icon  
                    name="ios-menu"
                    type="ionicon"
                    color="white"
                    size={Platform.OS==='ios'?30:40}
                     onPress={(e)=>{this.props.navigation.toggleDrawer(e)}}
                    />
                      }
                  />

                    <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
                    {this.state.orders.length>0 && <FlatList
                     onRefresh={this.handleRefresh}
                     data={this.state.orders}
                     refreshing={this.state.refreshing}
                     renderItem={({item,index})=>{
                         let amount = (parseInt(item.amount))/100
                           return <View style={{width:'100%',flexDirection:'row'}}>
                    <Avatar containerStyle={{marginLeft:5,marginTop:15}}
                   size="medium"
                   rounded
                   source={{
                      uri:item.imageLink,
                     }}
                     />  
                 <View style={{marginLeft:15,marginTop:20,borderBottomColor:'#4d2600',borderBottomWidth:2,paddingBottom:15,flexBasis:'70%'}}>
                 <TouchableOpacity onPress={()=>{
                   this.props.renderOrder(item)
                   this.props.showOrderModal()
                 }}>
                    
                    <Text style={{fontSize:20,fontWeight:"bold"}}>{item.title}</Text>
                    <Text>{item.description.substring(0,30)}</Text>
                    <Text style={{fontSize:18,textAlign:'right',fontWeight:'bold'}}>${amount.toString()}</Text>
                    </TouchableOpacity>
                 </View>
                     </View>
                     }}
                     keyExtractor={item => item._id}
                    />}
                     </View>
                     <OrderDetails/>
                         </View>
         )
     }
 }

 function mapStateToProps(state){
   return({
     UID:state.rootReducer.UID
   })
 }
 function mapActionsToProps(dispatch){
   return({
      showOrderModal:()=>{
        dispatch(showOrderModalAction())
      },
      renderOrder:(order)=>{
        dispatch(renderOrderAction(order))
      }
   })
 }
 export default connect(mapStateToProps,mapActionsToProps)(Orders)
